export interface TranslationDictionary {
  brand_name: string;
  footer_tagline: string;
  footer_support: string;
  greeting: string;
  intro: string;
  code_label: string;
  expires_in: string;
  status_label: string;
  action_button: string;
}

export const translations: Record<"en" | "tl", TranslationDictionary> = {
  en: {
    brand_name: "Rise to Rice",
    footer_tagline: "Empowering low-income families through sustainable recycling.",
    footer_support: "Support & Inquiries",
    greeting: "Hello!",
    intro: "You requested a verification code to complete your action on Rise to Rice. Please use the verification code below to proceed:",
    code_label: "Your Verification Code",
    expires_in: "This code is valid for 10 minutes. If you did not request this, please ignore this email.",
    status_label: "Redemption Request Status",
    action_button: "Visit Rise to Rice",
  },
  tl: {
    brand_name: "Rise to Rice",
    footer_tagline: "Pagbibigay-kapangyarihan sa mga pamilya sa pamamagitan ng recycling.",
    footer_support: "Suporta at mga Katanungan",
    greeting: "Kumusta!",
    intro: "Humingi ka ng verification code para makumpleto ang iyong aksyon sa Rise to Rice. Mangyaring gamitin ang verification code sa ibaba upang magpatuloy:",
    code_label: "Iyong Verification Code",
    expires_in: "Ang code na ito ay valid sa loob ng 10 minuto. Kung hindi mo ito hiniling, mangyaring balewalain ang email na ito.",
    status_label: "Katayuan ng Iyong Redeem Request",
    action_button: "Pumunta sa Rise to Rice",
  },
};

// Base master HTML template layout for EJS
export const BASE_LAYOUT = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= subject %></title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F6F3; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #2C3E2B;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F4F6F3; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(45, 90, 39, 0.08); border: 1px solid #E2E8F0;">
          <!-- Top Accent Bar -->
          <tr>
            <td height="6" style="background-color: #2D5A27;"></td>
          </tr>
          
          <!-- Header (Logo) -->
          <tr>
            <td align="center" style="padding: 30px 40px 20px 40px; background-color: #ffffff;">
              <img src="https://res.cloudinary.com/dvn0iyh3v/image/upload/v1779170037/COMPONY_LOGO_NO_BG_oilthd.png" alt="Rise to Rice Logo" width="150" style="display: block; border: 0; outline: none; text-decoration: none;">
            </td>
          </tr>
          
          <!-- Body Content -->
          <tr>
            <td style="padding: 20px 40px 40px 40px; background-color: #ffffff; font-size: 16px; line-height: 1.6; color: #2C3E2B;">
              <%- bodyContent %>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #F8FAF7; border-top: 1px solid #EDF2EE; text-align: center; font-size: 12px; line-height: 1.5; color: #718096;">
              <p style="margin: 0 0 10px 0; font-weight: 600; color: #2D5A27; text-transform: uppercase; letter-spacing: 1px;"><%= t.brand_name %></p>
              <p style="margin: 0 0 15px 0;"><%= t.footer_tagline %></p>
              <p style="margin: 0 0 5px 0;">Barangay Bagong Silangan, Quezon City, Philippines</p>
              <p style="margin: 0;"><%= t.footer_support %>: <a href="mailto:barangaybagongsilangan123@gmail.com" style="color: #2D5A27; text-decoration: none; font-weight: 500;">barangaybagongsilangan123@gmail.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const VERIFICATION_TEMPLATE = `
<h2 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 700; color: #1A361D;"><%= t.greeting %></h2>
<p style="margin: 0 0 25px 0;"><%= t.intro %></p>

<table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
  <tr>
    <td align="center" style="background-color: #F0F7F0; border-radius: 8px; padding: 20px; border: 1px dashed #A5D6A7;">
      <span style="font-size: 12px; color: #558B2F; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; display: block; margin-bottom: 8px;"><%= t.code_label %></span>
      <span style="font-size: 36px; font-weight: 800; color: #2D5A27; letter-spacing: 6px; font-family: 'Courier New', monospace;"><%= code %></span>
    </td>
  </tr>
</table>

<p style="margin: 0; font-size: 14px; color: #718096;"><%= t.expires_in %></p>
`;

export const STATUS_UPDATE_TEMPLATE = `
<h2 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 700; color: #1A361D;"><%= t.greeting %></h2>
<p style="margin: 0 0 25px 0;"><%= t.intro %></p>

<table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px; border-collapse: separate; border-spacing: 0;">
  <tr>
    <td style="padding: 15px; background-color: #F8FAF7; border: 1px solid #EDF2EE; border-radius: 8px 8px 0 0; font-weight: bold; color: #556B2F;">
      <%= t.status_label %>:
      <span style="display: inline-block; padding: 4px 10px; font-size: 14px; font-weight: bold; border-radius: 20px; margin-left: 10px; background-color: <%= badgeBgColor %>; color: <%= badgeTextColor %>; border: 1px solid <%= badgeBorderColor %>;">
        <%= statusText %>
      </span>
    </td>
  </tr>
  <tr>
    <td style="padding: 20px; background-color: #ffffff; border: 1px solid #EDF2EE; border-top: none; border-radius: 0 0 8px 8px; font-size: 15px; color: #2C3E2B; line-height: 1.6;">
      <%= statusMessage %>
    </td>
  </tr>
</table>

<div align="center" style="margin-top: 30px; margin-bottom: 10px;">
  <a href="<%= websiteUrl %>" style="display: inline-block; background-color: #2D5A27; color: #ffffff; font-weight: 600; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-size: 15px; box-shadow: 0 4px 6px rgba(45, 90, 39, 0.15);"><%= t.action_button %></a>
</div>
`;
