import SMTPTransport from "nodemailer/lib/smtp-transport";
import { transporter } from "../nodemailer/transporter";
import { RedeemRequestStatus } from "../types/redeem-request";

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<SMTPTransport.SentMessageInfo | Error> {
  try {
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL_ADDRESS,
      to,
      subject,
      text,
      html,
    });

    return info;
  } catch (error) {
    return error as Error;
  }
}

export async function sendStatusUpdateEmail(
  to: string,
  subject: string,
  status: RedeemRequestStatus,
  html?: string
): Promise<SMTPTransport.SentMessageInfo | Error> {
  const templates = [
    {
      status: "For Pick Up",
      message:
        "Your redeem request is ready for pick up. You can now visit the barangay hall to claim your reward.",
    },
    {
      status: "Completed",
      message: "Your redeem request has been completed. Thank you for your patience.",
    },
    {
      status: "Rejected",
      message: "Your redeem request has been rejected. Please contact us for more information.",
    },
    {
      status: "Cancelled",
      message: "Your redeem request has been cancelled. Please contact us for more information.",
    },
    {
      status: "Pending",
      message: "Your redeem request is pending. Please wait for further updates.",
    },
  ];

  let text;

  const statusObj = templates.find((t) => t.status === status);
  if (statusObj) {
    text = statusObj.message;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL_ADDRESS,
      to,
      subject,
      text,
      html,
    });

    return info;
  } catch (error) {
    return error as Error;
  }
}
