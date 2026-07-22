import mysql from "mysql2/promise";
import { nanoid } from "nanoid";

const pool = mysql.createPool({
  host: process.env.DB_HOSTNAME,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function runMigrations() {
  try {
    const [columns]: any = await pool.query("SHOW COLUMNS FROM `user` LIKE 'preferred_language'");
    if (columns.length === 0) {
      await pool.query("ALTER TABLE `user` ADD COLUMN `preferred_language` VARCHAR(5) DEFAULT 'en'");
      console.log("Database Migration: Added preferred_language column to user table successfully.");
    }

    // redeem_request columns
    const [rrColumns]: any = await pool.query("SHOW COLUMNS FROM `redeem_request`");
    const rrColNames = rrColumns.map((c: any) => c.Field);
    
    if (!rrColNames.includes('admin_notes')) {
      await pool.query("ALTER TABLE `redeem_request` ADD COLUMN `admin_notes` TEXT DEFAULT NULL");
    }
    if (!rrColNames.includes('cancel_reason')) {
      await pool.query("ALTER TABLE `redeem_request` ADD COLUMN `cancel_reason` TEXT DEFAULT NULL");
    }
    if (!rrColNames.includes('nano_id')) {
      await pool.query("ALTER TABLE `redeem_request` ADD COLUMN `nano_id` VARCHAR(21) DEFAULT NULL UNIQUE");
    }
    if (!rrColNames.includes('updated_at')) {
      await pool.query("ALTER TABLE `redeem_request` ADD COLUMN `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    }
    // Always Backfill nano_id if any are NULL
    const [rrNullRows]: any = await pool.query("SELECT redeem_request_id FROM `redeem_request` WHERE `nano_id` IS NULL");
    for (const row of rrNullRows) {
      await pool.query("UPDATE `redeem_request` SET `nano_id` = ? WHERE `redeem_request_id` = ?", [nanoid(), row.redeem_request_id]);
    }

    // modify enum
    await pool.query("ALTER TABLE `redeem_request` MODIFY `status` ENUM('pending', 'working', 'for pick up', 'completed', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending'");

    // exchange_log columns
    const [elColumns]: any = await pool.query("SHOW COLUMNS FROM `exchange_log`");
    const elColNames = elColumns.map((c: any) => c.Field);

    if (!elColNames.includes('image_url')) {
      await pool.query("ALTER TABLE `exchange_log` ADD COLUMN `image_url` VARCHAR(255) DEFAULT NULL");
    }
    if (!elColNames.includes('nano_id')) {
      await pool.query("ALTER TABLE `exchange_log` ADD COLUMN `nano_id` VARCHAR(21) DEFAULT NULL UNIQUE");
    }
    if (!elColNames.includes('updated_at')) {
      await pool.query("ALTER TABLE `exchange_log` ADD COLUMN `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    }
    // Always Backfill nano_id if any are NULL
    const [elNullRows]: any = await pool.query("SELECT exchange_log_id FROM `exchange_log` WHERE `nano_id` IS NULL");
    for (const row of elNullRows) {
      await pool.query("UPDATE `exchange_log` SET `nano_id` = ? WHERE `exchange_log_id` = ?", [nanoid(), row.exchange_log_id]);
    }

    // announcement columns
    const [aColumns]: any = await pool.query("SHOW COLUMNS FROM `announcement`");
    const aColNames = aColumns.map((c: any) => c.Field);
    if (!aColNames.includes('flare')) {
      await pool.query("ALTER TABLE `announcement` ADD COLUMN `flare` VARCHAR(50) NOT NULL DEFAULT 'General'");
      console.log("Database Migration: Added flare column to announcement table successfully.");
    }

    // Run data migrations for old flares to new flares
    console.log("Database Migration: Mapping old announcement flares to new ones...");
    await pool.query("UPDATE `announcement` SET `flare` = 'General' WHERE `flare` IN ('Rice Impact', 'Water', 'Plastic', 'Milestone', 'Community')");
    await pool.query("UPDATE `announcement` SET `flare` = 'Sustainability' WHERE `flare` IN ('Campaign', 'Tips')");
    await pool.query("UPDATE `announcement` SET `flare` = 'Scheduling' WHERE `flare` = 'Schedule'");
    await pool.query("UPDATE `announcement` SET `flare` = 'Maintenance' WHERE `flare` = 'Update'");
    await pool.query("UPDATE `announcement` SET `flare` = 'Partners' WHERE `flare` = 'Partnership'");
    await pool.query("UPDATE `announcement` SET `flare` = 'General' WHERE `flare` NOT IN ('Scheduling', 'Maintenance', 'Policy', 'Materials', 'Rewards', 'Redemption', 'Partners', 'Sustainability', 'General', 'Urgent') OR `flare` IS NULL");

    // Modify the column to be a strict ENUM with a default of 'General'
    await pool.query(
      "ALTER TABLE `announcement` MODIFY `flare` ENUM('Scheduling', 'Maintenance', 'Policy', 'Materials', 'Rewards', 'Redemption', 'Partners', 'Sustainability', 'General', 'Urgent') NOT NULL DEFAULT 'General'"
    );
    console.log("Database Migration: Altered flare column to strict ENUM successfully.");

    console.log("Database Migration completed successfully.");
  } catch (error) {
    console.error("Database Migration failed:", error);
  }
}
runMigrations();

export default pool;
