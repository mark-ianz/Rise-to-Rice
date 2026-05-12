const assert = require("node:assert/strict");

process.env.ACCESS_TOKEN_SECRET = "test-access-secret";
process.env.REFRESH_TOKEN_SECRET = "test-refresh-secret";
process.env.SALT_ROUND = "4";

const pool = require("../dist/connection/database").default;
const authController = require("../dist/controllers/auth");
const tokenHelper = require("../dist/helpers/token");
const loginHelper = require("../dist/helpers/login");
const { hashPassword } = require("../dist/helpers/hash");

function createResponseRecorder() {
  return {
    statusCode: 200,
    body: undefined,
    cookies: [],
    clearedCookies: [],
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    cookie(name, value, options) {
      this.cookies.push({ name, value, options });
      return this;
    },
    clearCookie(name) {
      this.clearedCookies.push(name);
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

function getCookieValue(res, name) {
  return res.cookies.find((cookie) => cookie.name === name)?.value;
}

async function main() {
  await runTest(
    "login replaces older refresh tokens for the user before storing a new one",
    async () => {
      const storedHash = hashPassword("password123");
      const executedQueries = [];
      const connection = createConnection(async (sql, params = []) => {
        executedQueries.push({ sql, params });

        if (sql.includes("SELECT * FROM account WHERE email = ?")) {
          return [[{ user_id: 7, account_id: 12, password: storedHash }]];
        }

        if (sql.includes("SELECT r.role_name FROM role AS r")) {
          return [[{ role_name: "user" }]];
        }

        if (sql.includes("DELETE FROM refresh_token WHERE expired_at < NOW()")) {
          return [{ affectedRows: 2 }];
        }

        if (sql.includes("DELETE FROM refresh_token WHERE user_id = ?")) {
          return [{ affectedRows: 1 }];
        }

        if (sql.includes("INSERT INTO refresh_token")) {
          return [{ affectedRows: 1 }];
        }

        throw new Error(`Unexpected query: ${sql}`);
      });

      const req = {};
      const res = createResponseRecorder();

      await loginHelper.login(
        connection,
        "user@example.com",
        "password123",
        req,
        res
      );

      assert.deepEqual(req.user, {
        email: "user@example.com",
        user_id: 7,
        account_id: 12,
        isAdmin: false,
        role: "user",
      });

      const deleteExpiredIndex = executedQueries.findIndex((entry) =>
        entry.sql.includes("DELETE FROM refresh_token WHERE expired_at < NOW()")
      );
      const deleteUserIndex = executedQueries.findIndex((entry) =>
        entry.sql.includes("DELETE FROM refresh_token WHERE user_id = ?")
      );
      const insertIndex = executedQueries.findIndex((entry) =>
        entry.sql.includes("INSERT INTO refresh_token")
      );

      assert.ok(deleteExpiredIndex >= 0, "expired refresh tokens should be cleaned");
      assert.ok(deleteUserIndex >= 0, "existing user refresh tokens should be removed");
      assert.ok(insertIndex > deleteUserIndex, "new refresh token should be inserted after revocation");
      assert.equal(executedQueries[deleteUserIndex].params[0], 7);
      assert.ok(getCookieValue(res, "refreshToken"));
      assert.ok(getCookieValue(res, "authToken"));
    }
  );

  await runTest(
    "refresh-token validation rotates the stored token instead of inserting a new row",
    async () => {
      const executedQueries = [];
      const connection = createConnection(async (sql, params = []) => {
        executedQueries.push({ sql, params });

        if (sql.includes("DELETE FROM refresh_token WHERE expired_at < NOW()")) {
          return [{ affectedRows: 0 }];
        }

        if (sql.includes("SELECT rt.user_id, a.email, a.account_id")) {
          return [[{
            user_id: 7,
            email: "user@example.com",
            account_id: 12,
            expired_at: "2999-01-01 00:00:00",
            token: "old-refresh-token",
          }]];
        }

        if (sql.includes("SELECT r.role_name FROM user_role AS ur")) {
          return [[{ role_name: "user" }]];
        }

        if (sql.includes("UPDATE refresh_token SET token = ?")) {
          return [{ affectedRows: 1 }];
        }

        throw new Error(`Unexpected query: ${sql}`);
      });

      pool.getConnection = async () => connection;

      const req = {
        cookies: {
          refreshToken: "old-refresh-token",
        },
      };
      const res = createResponseRecorder();

      const user = await tokenHelper.getUserWithRefreshToken(req, res);

      assert.deepEqual(user, {
        email: "user@example.com",
        user_id: 7,
        account_id: 12,
        isAdmin: false,
        role: "user",
      });
      assert.deepEqual(req.user, user);

      const rotateQuery = executedQueries.find((entry) =>
        entry.sql.includes("UPDATE refresh_token SET token = ?")
      );

      assert.ok(rotateQuery, "refresh-token lookup should rotate the stored token");
      assert.equal(rotateQuery.params[1], "old-refresh-token");
      assert.notEqual(rotateQuery.params[0], "old-refresh-token");
      assert.equal(getCookieValue(res, "refreshToken"), rotateQuery.params[0]);
      assert.ok(getCookieValue(res, "authToken"));
      assert.equal(
        executedQueries.some((entry) => entry.sql.includes("INSERT INTO refresh_token")),
        false
      );
    }
  );

  await runTest(
    "logout deletes the stored refresh tokens for the active user and clears cookies",
    async () => {
      const executedQueries = [];
      const connection = createConnection(async (sql, params = []) => {
        executedQueries.push({ sql, params });

        if (sql.includes("DELETE FROM refresh_token WHERE expired_at < NOW()")) {
          return [{ affectedRows: 1 }];
        }

        if (sql.includes("SELECT user_id FROM refresh_token WHERE token = ?")) {
          return [[{ user_id: 7 }]];
        }

        if (sql.includes("DELETE FROM refresh_token WHERE user_id = ?")) {
          return [{ affectedRows: 2 }];
        }

        throw new Error(`Unexpected query: ${sql}`);
      });

      pool.getConnection = async () => connection;

      const req = {
        cookies: {
          authToken: "auth-token",
          refreshToken: "stored-refresh-token",
        },
        user: {
          user_id: 7,
        },
      };
      const res = createResponseRecorder();

      await authController.logoutUser(req, res);

      assert.equal(res.statusCode, 200);
      assert.deepEqual(res.body, { message: "Logged out successfully" });
      assert.deepEqual(res.clearedCookies, ["authToken", "refreshToken"]);
      assert.equal(req.user, undefined);
      assert.equal(
        executedQueries.some((entry) => entry.sql.includes("DELETE FROM refresh_token WHERE user_id = ?")),
        true
      );
    }
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
