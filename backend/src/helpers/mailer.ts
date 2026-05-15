import { resend } from "../nodemailer/transporter";
import { RedeemRequestStatus } from "../types/redeem-request";

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<any> {
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    if (error) {
      return error;
    }

    return data;
  } catch (error) {
    return error as Error;
  }
}

export async function sendStatusUpdateEmail(
  to: string,
  subject: string,
  status: RedeemRequestStatus,
  html?: string
): Promise<any> {
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

  let text = "";

  const statusObj = templates.find((t) => t.status === status);
  if (statusObj) {
    text = statusObj.message;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    if (error) {
      return error;
    }

    return data;
  } catch (error) {
    return error as Error;
  }
}

