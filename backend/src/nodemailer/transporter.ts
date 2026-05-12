import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_SMTP_HOST,
  port: Number(process.env.NODEMAILER_SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.NODEMAILER_EMAIL_ADDRESS,
    pass: process.env.NODEMAILER_EMAIL_PASSWORD,
  },
});
