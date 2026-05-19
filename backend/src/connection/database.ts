import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Self-executing migration check to automatically add language preference column
async function runMigrations() {
  try {
    const [columns]: any = await pool.query("SHOW COLUMNS FROM `user` LIKE 'preferred_language'");
    if (columns.length === 0) {
      await pool.query("ALTER TABLE `user` ADD COLUMN `preferred_language` VARCHAR(5) DEFAULT 'en'");
      console.log("Database Migration: Added preferred_language column to user table successfully.");
    }
  } catch (error) {
    console.error("Database Migration failed:", error);
  }
}
runMigrations();

export default pool;
