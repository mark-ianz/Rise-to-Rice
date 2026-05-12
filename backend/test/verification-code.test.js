const assert = require("node:assert/strict");

process.env.SALT_ROUND = "4";

const pool = require("../dist/connection/database").default;
const userController = require("../dist/controllers/user");
const mailer = require("../dist/helpers/mailer");
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
  const originalSendEmail = mailer.sendEmail;
  const originalPoolQuery = pool.query;

  try {
    await runTest(
      "requestVerificationCode uses the transaction connection for verification-code queries",
      async () => {
        const connectionQueries = [];
        const sentEmails = [];

        pool.query = async () => {
          throw new Error("requestVerificationCode should not use pool.query");
        };

        pool.getConnection = async () =>
          createConnection(async (sql, params = []) => {
            connectionQueries.push({ sql, params });

            if (sql.includes("SELECT * FROM email_verification_code")) {
              return [[]];
            }

            if (sql.includes("SELECT * FROM account WHERE email = ?")) {
              return [[{ email: params[0] }]];
            }

            if (sql.includes("INSERT INTO email_verification_code")) {
              return [{ affectedRows: 1 }];
            }

            throw new Error(`Unexpected query: ${sql}`);
          });

        mailer.sendEmail = async (...args) => {
          sentEmails.push(args);
        };

        const req = {
          body: {
            email: "user@example.com",
            type: "forgot-password",
          },
        };
        const res = createResponseRecorder();

        await userController.requestVerificationCode(req, res);

        assert.equal(res.statusCode, 200);
        assert.deepEqual(res.body, {
          message: "Verification code sent to your email.",
        });
        assert.equal(sentEmails.length, 1);
        assert.equal(
          connectionQueries.some((entry) =>
            entry.sql.includes("SELECT * FROM email_verification_code")
          ),
          true
        );
        assert.equal(
          connectionQueries.some((entry) =>
            entry.sql.includes("INSERT INTO email_verification_code")
          ),
          true
        );
      }
    );

    await runTest(
      "verifyVerificationCode rejects missing verification-code records",
      async () => {
        pool.getConnection = async () =>
          createConnection(async (sql) => {
            if (sql.includes("SELECT * FROM email_verification_code")) {
              return [[]];
            }

            throw new Error(`Unexpected query: ${sql}`);
          });

        const req = {
          body: {
            email: "missing@example.com",
            code: "123456",
            type: "forgot-password",
          },
        };
        const res = createResponseRecorder();

        await userController.verifyVerificationCode(req, res);

        assert.equal(res.statusCode, 400);
        assert.deepEqual(res.body, {
          errors: [{ path: undefined, message: "Verification code is invalid." }],
        });
      }
    );

    await runTest(
      "verifyVerificationCode deletes expired verification-code records",
      async () => {
        const deletedRecords = [];

        pool.getConnection = async () =>
          createConnection(async (sql, params) => {
            if (sql.includes("SELECT * FROM email_verification_code")) {
              return [[{
                email: params[0],
                type: params[1],
                code: hashPassword("123456"),
                expires_at: "2000-01-01 00:00:00",
              }]];
            }

            if (sql.includes("DELETE FROM email_verification_code")) {
              deletedRecords.push(params);
              return [{ affectedRows: 1 }];
            }

            throw new Error(`Unexpected query: ${sql}`);
          });

        const req = {
          body: {
            email: "expired@example.com",
            code: "123456",
            type: "register",
          },
        };
        const res = createResponseRecorder();

        await userController.verifyVerificationCode(req, res);

        assert.equal(res.statusCode, 400);
        assert.deepEqual(res.body, {
          error: [{ message: "Verification code expired." }],
        });
        assert.deepEqual(deletedRecords, [["expired@example.com", "register"]]);
      }
    );
  } finally {
    mailer.sendEmail = originalSendEmail;
    pool.query = originalPoolQuery;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
