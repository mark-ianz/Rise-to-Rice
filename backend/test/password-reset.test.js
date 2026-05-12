const assert = require("node:assert/strict");

process.env.MINIMUM_PASSWORD_LENGTH = "8";
process.env.CONTACT_NUMBER_LENGTH = "11";
process.env.SALT_ROUND = "4";

const pool = require("../dist/connection/database").default;
const userController = require("../dist/controllers/user");
const { comparePassword, hashPassword } = require("../dist/helpers/hash");

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
  await runTest(
    "valid forgot-password flow requires OTP verification proof and consumes it after reset",
    async () => {
      const email = "user@example.com";
      const otpCode = "123456";
      const storedOtpHash = hashPassword(otpCode);
      const storedResetHashes = [];
      const resetUpdates = [];
      const proofDeletes = [];

      let verificationConnection;
      let resetConnection;
      let getConnectionCall = 0;

      verificationConnection = createConnection(async (sql, params) => {
        if (sql.includes("SELECT * FROM email_verification_code")) {
          return [[{ email, type: "forgot-password", code: storedOtpHash, expires_at: "2999-01-01 00:00:00" }]];
        }

        if (sql.includes("UPDATE email_verification_code SET code = ?")) {
          storedResetHashes.push(params[0]);
          return [{ affectedRows: 1 }];
        }

        throw new Error(`Unexpected verification query: ${sql}`);
      });

      resetConnection = createConnection(async (sql, params) => {
        if (sql.includes("SELECT * FROM email_verification_code")) {
          return [[{ email, type: "forgot-password", code: storedResetHashes[0], expires_at: "2999-01-01 00:00:00" }]];
        }

        if (sql.includes("UPDATE account SET password = ? WHERE email = ?")) {
          resetUpdates.push(params);
          return [{ affectedRows: 1 }];
        }

        if (sql.includes("DELETE FROM email_verification_code")) {
          proofDeletes.push(params);
          return [{ affectedRows: 1 }];
        }

        throw new Error(`Unexpected reset query: ${sql}`);
      });

      pool.getConnection = async () => {
        getConnectionCall += 1;
        return getConnectionCall === 1 ? verificationConnection : resetConnection;
      };

      const verifyReq = {
        body: {
          email,
          code: otpCode,
          type: "forgot-password",
        },
      };
      const verifyRes = createResponseRecorder();

      await userController.verifyVerificationCode(verifyReq, verifyRes);

      assert.equal(verifyRes.statusCode, 200);
      assert.equal(typeof verifyRes.body.reset_token, "string");
      assert.ok(verifyRes.body.reset_token.length >= 32);
      assert.equal(storedResetHashes.length, 1);
      assert.ok(
        comparePassword(verifyRes.body.reset_token, storedResetHashes[0]),
        "reset proof should be hashed before storage"
      );

      const resetReq = {
        body: {
          email,
          password: "newpassword123",
          reset_token: verifyRes.body.reset_token,
        },
      };
      const resetRes = createResponseRecorder();

      await userController.resetPassword(resetReq, resetRes);

      assert.equal(resetRes.statusCode, 200);
      assert.deepEqual(resetRes.body, {
        message: "Password reset successfully.",
      });
      assert.equal(resetUpdates.length, 1);
      assert.equal(resetUpdates[0][1], email);
      assert.equal(proofDeletes.length, 1);
      assert.deepEqual(proofDeletes[0], [email, "forgot-password"]);
    }
  );

  await runTest("reset password is rejected without verified OTP proof", async () => {
    const email = "missing@example.com";

    pool.getConnection = async () =>
      createConnection(async (sql) => {
        if (sql.includes("SELECT * FROM email_verification_code")) {
          return [[]];
        }

        throw new Error(`Unexpected query: ${sql}`);
      });

    const req = {
      body: {
        email,
        password: "newpassword123",
        reset_token: "a".repeat(64),
      },
    };
    const res = createResponseRecorder();

    await userController.resetPassword(req, res);

    assert.equal(res.statusCode, 403);
    assert.deepEqual(res.body, {
      errors: [{ message: "Password reset verification is required." }],
    });
  });

  await runTest("reset password rejects expired reset proofs", async () => {
    const expiredProof = "b".repeat(64);

    pool.getConnection = async () =>
      createConnection(async (sql, params) => {
        if (sql.includes("SELECT * FROM email_verification_code")) {
          return [[{ email: params[0], type: "forgot-password", code: hashPassword(expiredProof), expires_at: "2000-01-01 00:00:00" }]];
        }

        if (sql.includes("DELETE FROM email_verification_code")) {
          return [{ affectedRows: 1 }];
        }

        throw new Error(`Unexpected query: ${sql}`);
      });

    const req = {
      body: {
        email: "expired@example.com",
        password: "newpassword123",
        reset_token: expiredProof,
      },
    };
    const res = createResponseRecorder();

    await userController.resetPassword(req, res);

    assert.equal(res.statusCode, 403);
    assert.deepEqual(res.body, {
      errors: [{ message: "Password reset proof has expired." }],
    });
  });

  await runTest("reset password rejects invalid reset proofs", async () => {
    const storedProof = "c".repeat(64);
    const submittedProof = "d".repeat(64);

    pool.getConnection = async () =>
      createConnection(async (sql, params) => {
        if (sql.includes("SELECT * FROM email_verification_code")) {
          return [[{ email: params[0], type: "forgot-password", code: hashPassword(storedProof), expires_at: "2999-01-01 00:00:00" }]];
        }

        throw new Error(`Unexpected query: ${sql}`);
      });

    const req = {
      body: {
        email: "invalid@example.com",
        password: "newpassword123",
        reset_token: submittedProof,
      },
    };
    const res = createResponseRecorder();

    await userController.resetPassword(req, res);

    assert.equal(res.statusCode, 403);
    assert.deepEqual(res.body, {
      errors: [{ message: "Password reset proof is invalid." }],
    });
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
