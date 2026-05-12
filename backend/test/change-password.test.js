const assert = require("node:assert/strict");

process.env.MINIMUM_PASSWORD_LENGTH = "8";
process.env.SALT_ROUND = "4";

const pool = require("../dist/connection/database").default;
const userController = require("../dist/controllers/user");
const authMiddleware = require("../dist/middleware/authentication");
const { hashPassword, comparePassword } = require("../dist/helpers/hash");

function createResponseRecorder() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function createConnection(queryHandler) {
  return {
    beginTransaction: async () => {},
    commit: async () => {},
    rollback: async () => {},
    release: () => {},
    query: queryHandler,
  };
}

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

async function main() {
  await runTest("change password rejects requests for another user", async () => {
    const req = {
      params: { id: "2" },
      user: { user_id: 1, isAdmin: true },
    };
    const res = createResponseRecorder();
    let nextCalled = false;

    authMiddleware.requireSelf(req, res, () => {
      nextCalled = true;
    });

    assert.equal(res.statusCode, 403);
    assert.deepEqual(res.body, { error: "Forbidden request" });
    assert.equal(nextCalled, false);
  });

  await runTest("change password validates request body before querying", async () => {
    let queryCalled = false;

    pool.getConnection = async () =>
      createConnection(async () => {
        queryCalled = true;
        return [[]];
      });

    const req = {
      params: { id: "1" },
      body: {
        password: "",
        new_password: "short",
      },
    };
    const res = createResponseRecorder();

    await userController.changePassword(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, {
      errors: [
        { path: "password", message: "Current password is required." },
        {
          path: "new_password",
          message: "Password must be at least 8 characters long.",
        },
      ],
    });
    assert.equal(queryCalled, false);
  });

  await runTest("change password updates the stored password for valid input", async () => {
    const currentPassword = "oldpassword123";
    const newPassword = "newpassword123";
    const storedHash = hashPassword(currentPassword);
    const updateCalls = [];

    pool.getConnection = async () =>
      createConnection(async (sql, params) => {
        if (sql.includes("SELECT * FROM account WHERE user_id = ?")) {
          return [[{ password: storedHash }]];
        }

        if (sql.includes("UPDATE account SET password = ? WHERE user_id = ?")) {
          updateCalls.push(params);
          return [{ affectedRows: 1 }];
        }

        throw new Error(`Unexpected query: ${sql}`);
      });

    const req = {
      params: { id: "1" },
      body: {
        password: currentPassword,
        new_password: newPassword,
      },
    };
    const res = createResponseRecorder();

    await userController.changePassword(req, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, {
      message: "Password changed successfully.",
    });
    assert.equal(updateCalls.length, 1);
    assert.equal(updateCalls[0][1], "1");
    assert.ok(
      comparePassword(newPassword, updateCalls[0][0]),
      "new password should be hashed before storage"
    );
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
