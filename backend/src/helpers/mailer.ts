import { resend } from "../nodemailer/transporter";
import { RedeemRequestStatus } from "../types/redeem-request";
import ejs from "ejs";
import {
  BASE_LAYOUT,
  VERIFICATION_TEMPLATE,
  STATUS_UPDATE_TEMPLATE,
  EXCHANGE_TEMPLATE,
  RECEIPT_TEMPLATE,
  translations,
} from "../templates/emailTemplates";

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string,
  options?: {
    lang?: "en" | "tl";
    code?: string;
    actionUrl?: string;
    firstName?: string;
    adminNotes?: string;
    statusInfo?: {
      status: string;
      message: string;
    };
    exchangeInfo?: {
      materialName: string;
      weight: number;
      pointsAdded: number;
      loggedBy?: string;
    };
    receiptInfo?: {
      rewardName: string;
      quantity: string;
      pointsCost: number;
    };
  }
): Promise<any> {
  try {
    const lang = options?.lang === "tl" ? "tl" : "en";
    const t = translations[lang];

    let renderedHtml = html;

    if (!renderedHtml) {
      let bodyContent = "";

      if (options?.code) {
        bodyContent = ejs.render(VERIFICATION_TEMPLATE, {
          t,
          code: options.code,
          firstName: options.firstName || "",
        });
      } else if (options?.exchangeInfo) {
        bodyContent = ejs.render(EXCHANGE_TEMPLATE, {
          t,
          firstName: options.firstName || "",
          materialName: options.exchangeInfo.materialName,
          weight: options.exchangeInfo.weight,
          pointsAdded: options.exchangeInfo.pointsAdded,
          loggedBy: options.exchangeInfo.loggedBy || "",
          websiteUrl: options?.actionUrl || process.env.FRONTEND_URL || "http://localhost:5173",
          lang,
        });
      } else if (options?.receiptInfo) {
        bodyContent = ejs.render(RECEIPT_TEMPLATE, {
          t,
          firstName: options.firstName || "",
          rewardName: options.receiptInfo.rewardName,
          quantity: options.receiptInfo.quantity,
          pointsCost: options.receiptInfo.pointsCost,
          websiteUrl: options?.actionUrl || process.env.FRONTEND_URL || "http://localhost:5173",
          lang,
        });
      } else if (options?.statusInfo) {
        const status = options.statusInfo.status.toLowerCase();
        let badgeBgColor = "#EDF2EE";
        let badgeTextColor = "#4A5568";
        let badgeBorderColor = "#CBD5E0";
        let statusText = options.statusInfo.status;

        // Custom localized status label and colors
        if (status === "completed") {
          badgeBgColor = "#E8F5E9";
          badgeTextColor = "#2E7D32";
          badgeBorderColor = "#C8E6C9";
          statusText = lang === "tl" ? "Kumpleto" : "Completed";
        } else if (status === "for pick up") {
          badgeBgColor = "#FFF3E0";
          badgeTextColor = "#E65100";
          badgeBorderColor = "#FFE0B2";
          statusText = lang === "tl" ? "Maaari Nang Kunin" : "For Pick Up";
        } else if (status === "rejected") {
          badgeBgColor = "#FFEBEE";
          badgeTextColor = "#C62828";
          badgeBorderColor = "#FFCDD2";
          statusText = lang === "tl" ? "Tinanggihan" : "Rejected";
        } else if (status === "cancelled") {
          badgeBgColor = "#ECEFF1";
          badgeTextColor = "#37474F";
          badgeBorderColor = "#CFD8DC";
          statusText = lang === "tl" ? "Nakansela" : "Cancelled";
        } else if (status === "pending") {
          badgeBgColor = "#E3F2FD";
          badgeTextColor = "#1565C0";
          badgeBorderColor = "#BBDEFB";
          statusText = lang === "tl" ? "Pinoproseso" : "Pending";
        } else if (status === "working") {
          badgeBgColor = "#FFF8E1";
          badgeTextColor = "#F57F17";
          badgeBorderColor = "#FFECB3";
          statusText = lang === "tl" ? "Tinatrabaho" : "Working";
        }

        bodyContent = ejs.render(STATUS_UPDATE_TEMPLATE, {
          t,
          statusText,
          statusMessage: options.statusInfo.message,
          badgeBgColor,
          badgeTextColor,
          badgeBorderColor,
          websiteUrl: options?.actionUrl || process.env.FRONTEND_URL || "http://localhost:5173",
          firstName: options?.firstName || "",
          adminNotes: options?.adminNotes || "",
          lang,
        });
      } else {
        // Fallback generic HTML wrapping for plain text messages
        const greetingText = lang === "tl" ? "Kumusta" : "Hello";
        bodyContent = `
          <h2 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 700; color: #1A361D;">${greetingText}${options?.firstName ? ", " + options.firstName : ""}!</h2>
          <p style="margin: 0; line-height: 1.6; color: #2C3E2B;">${text.replace(/\n/g, "<br>")}</p>
        `;
      }

      renderedHtml = ejs.render(BASE_LAYOUT, {
        subject,
        bodyContent,
        t,
      });
    }

    const { data, error } = await resend.emails.send({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to,
      subject,
      text,
      html: renderedHtml,
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
  html?: string,
  lang: "en" | "tl" = "en",
  actionUrl?: string,
  firstName?: string,
  adminNotes?: string
): Promise<any> {
  const templates = [
    {
      status: "For Pick Up",
      message:
        "Your redeem request is ready for pick up. You can now visit the barangay hall to claim your reward.",
      messageTl:
        "Ang iyong redeem request ay maaari nang kunin. Maaari ka nang pumunta sa barangay hall para makuha ang iyong reward.",
    },
    {
      status: "Completed",
      message: "Your redeem request has been completed. Thank you for your patience.",
      messageTl: "Ang iyong redeem request ay matagumpay nang nakumpleto. Maraming salamat sa iyong paglahok sa pagpapanatiling malinis ng ating komunidad!",
    },
    {
      status: "Rejected",
      message: "Your redeem request has been rejected. Please contact us for more information.",
      messageTl: "Ang iyong redeem request ay tinanggihan. Mangyaring makipag-ugnayan sa amin para sa karagdagang impormasyon.",
    },
    {
      status: "Cancelled",
      message: "Your redeem request has been cancelled. Please contact us for more information.",
      messageTl: "Ang iyong redeem request ay nakansela. Mangyaring makipag-ugnayan sa amin para sa karagdagang impormasyon.",
    },
    {
      status: "Pending",
      message: "Your redeem request is pending. Please wait for further updates.",
      messageTl: "Ang iyong redeem request ay kasalukuyang pinoproseso. Mangyaring maghintay para sa mga susunod na balita.",
    },
    {
      status: "Working",
      message: "Your redeem request is now being worked on.",
      messageTl: "Ang iyong redeem request ay kasalukuyang tinatrabaho na ng aming mga tauhan.",
    },
  ];

  const statusObj = templates.find((t) => t.status.toLowerCase() === status.toLowerCase());
  const text = statusObj
    ? (lang === "tl" ? statusObj.messageTl : statusObj.message)
    : "";

  return sendEmail(to, subject, text, html, {
    lang,
    actionUrl,
    firstName,
    adminNotes,
    statusInfo: {
      status,
      message: text,
    },
  });
}


