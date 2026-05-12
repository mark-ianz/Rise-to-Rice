const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");

process.env.ACCESS_TOKEN_SECRET = "test-access-secret";
process.env.REFRESH_TOKEN_SECRET = "test-refresh-secret";
process.env.SALT_ROUND = "4";

const pool = require("../dist/connection/database").default;
const authController = require("../dist/controllers/auth");
const authMiddleware = require("../dist/middleware/authentication");
const tokenHelper = require("../dist/helpers/token");
const { hashPassword } = require("../dist/helpers/hash");

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
    clearCookie() {
      return this;
    },
    cookie() {
      return this;
    },
  };
}

function createUser() {
  return {
    email: "user@example.com",
    user_id: 1,
    account_id: 10,
    isAdmin: false,
    role: "user",
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
  const originalGetUserWithRefreshToken = tokenHelper.getUserWithRefreshToken;

  try {
    await runTest(
      "requireAuth accepts a valid auth token without calling refresh-token lookup",
      async () => {
        const user = createUser();
        const authToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "15m",
        });

        let refreshCalls = 0;
        tokenHelper.getUserWithRefreshToken = async () => {
          refreshCalls += 1;
          return null;
        };

        const req = {
          cookies: {
            authToken,
          },
        };
        const res = createResponseRecorder();
        let nextCalled = false;

        await authMiddleware.requireAuth(req, res, () => {
          nextCalled = true;
        });

        assert.equal(res.statusCode, 200);
        assert.equal(nextCalled, true);
        assert.deepEqual(req.user, user);
        assert.equal(refreshCalls, 0);
      }
    );

    await runTest(
      "checkUser returns user data when auth token is valid",
      async () => {
        const user = createUser();
        const authToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "15m",
        });

        let refreshCalls = 0;
        tokenHelper.getUserWithRefreshToken = async () => {
          refreshCalls += 1;
          return null;
        };

        const req = {
          cookies: {
            authToken,
          },
        };
        const res = createResponseRecorder();

        await authController.checkUser(req, res);

        assert.equal(res.statusCode, 200);
        assert.deepEqual(res.body, user);
        assert.deepEqual(req.user, user);
        assert.equal(refreshCalls, 0);
      }
    );

    await runTest(
      "expired auth token falls back to refresh token in requireAuth and checkUser",
      async () => {
        const user = createUser();
        const expiredAuthToken = jwt.sign(
          user,
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: -1 }
        );

        let refreshCalls = 0;
        tokenHelper.getUserWithRefreshToken = async (req) => {
          refreshCalls += 1;
          req.user = user;
          return user;
        };

        const middlewareReq = {
          cookies: {
            authToken: expiredAuthToken,
            refreshToken: "refresh-token-value",
          },
        };
        const middlewareRes = createResponseRecorder();
        let nextCalled = false;

        await authMiddleware.requireAuth(middlewareReq, middlewareRes, () => {
          nextCalled = true;
        });

        assert.equal(middlewareRes.statusCode, 200);
        assert.equal(nextCalled, true);
        assert.deepEqual(middlewareReq.user, user);

        const controllerReq = {
          cookies: {
            authToken: expiredAuthToken,
            refreshToken: "refresh-token-value",
          },
        };
        const controllerRes = createResponseRecorder();

        await authController.checkUser(controllerReq, controllerRes);

        assert.equal(controllerRes.statusCode, 200);
        assert.deepEqual(controllerRes.body, user);
        assert.deepEqual(controllerReq.user, user);
        assert.equal(refreshCalls, 2);
      }
    );

    await runTest(
      "missing auth and refresh tokens is rejected consistently",
      async () => {
        tokenHelper.getUserWithRefreshToken = async () => {
          throw new Error("refresh helper should not be called");
        };

        const middlewareReq = {
          cookies: {},
        };
        const middlewareRes = createResponseRecorder();
        let nextCalled = false;

        await authMiddleware.requireAuth(middlewareReq, middlewareRes, () => {
          nextCalled = true;
        });

        assert.equal(middlewareRes.statusCode, 401);
        assert.deepEqual(middlewareRes.body, { error: "Unauthorized request" });
        assert.equal(nextCalled, false);

        const controllerReq = {
          cookies: {},
        };
        const controllerRes = createResponseRecorder();

        await authController.checkUser(controllerReq, controllerRes);

        assert.equal(controllerRes.statusCode, 401);
        assert.deepEqual(controllerRes.body, { error: "No tokens provided" });
      }
    );

    await runTest(
      "loginUser keeps HTTP error handling in the controller for invalid credentials",
      async () => {
        const storedHash = hashPassword("correct-password");

        pool.getConnection = async () =>
          createConnection(async (sql) => {
            if (sql.includes("SELECT * FROM account WHERE email = ?")) {
              return [[{
                user_id: 1,
                account_id: 10,
                password: storedHash,
              }]];
            }

            throw new Error(`Unexpected query: ${sql}`);
          });

        const req = {
          body: {
            email: "user@example.com",
            password: "wrong-password",
          },
        };
        const res = createResponseRecorder();

        await authController.loginUser(req, res);

        assert.equal(res.statusCode, 401);
        assert.deepEqual(res.body, {
          error: "Incorrect email or password",
        });
        assert.equal(req.user, undefined);
      }
    );
  } finally {
    tokenHelper.getUserWithRefreshToken = originalGetUserWithRefreshToken;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
