import landing_page_en from "@/translations/en/landing_page.json";
import landing_page_tl from "@/translations/tl/landing_page.json";
import announcements_en from "@/translations/en/announcements.json";
import announcements_tl from "@/translations/tl/announcements.json";
import education_and_awareness_en from "@/translations/en/education_and_awareness.json";
import education_and_awareness_tl from "@/translations/tl/education_and_awareness.json";
import about_us_en from "@/translations/en/about_us.json";
import about_us_tl from "@/translations/tl/about_us.json";
import contact_us_en from "@/translations/en/contact_us.json";
import contact_us_tl from "@/translations/tl/contact_us.json";
import register_en from "@/translations/en/register.json";
import register_tl from "@/translations/tl/register.json";
import form_en from "@/translations/en/form.json";
import form_tl from "@/translations/tl/form.json";
import profile_en from "@/translations/en/profile.json";
import profile_tl from "@/translations/tl/profile.json";
import redeem_rewards_en from "@/translations/en/redeem_rewards.json";
import redeem_rewards_tl from "@/translations/tl/redeem_rewards.json";
import header_en from "@/translations/en/header.json";
import header_tl from "@/translations/tl/header.json";
import analytics_en from "@/translations/en/analytics.json";
import analytics_tl from "@/translations/tl/analytics.json";
import global_en from "@/translations/en/global.json";
import global_tl from "@/translations/tl/global.json";
import login_en from "@/translations/en/login.json";
import login_tl from "@/translations/tl/login.json";
import forgot_password_en from "@/translations/en/forgot_password.json";
import forgot_password_tl from "@/translations/tl/forgot_password.json";
import footer_en from "@/translations/en/footer.json";
import footer_tl from "@/translations/tl/footer.json";
import change_password_en from "@/translations/en/change_password.json";
import change_password_tl from "@/translations/tl/change_password.json";
import user_home_en from "@/translations/en/user_home.json";
import user_home_tl from "@/translations/tl/user_home.json";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";

const language = localStorage.getItem("i18nextLng") || "en";

i18next.use(initReactI18next).init({
  lng: language,
  resources: {
    en: {
      global: global_en,
      landing_page: landing_page_en,
      announcements: announcements_en,
      education_and_awareness: education_and_awareness_en,
      about_us: about_us_en,
      contact_us: contact_us_en,
      register: register_en,
      form: form_en,
      profile: profile_en,
      redeem_rewards: redeem_rewards_en,
      header: header_en,
      analytics: analytics_en,
      login: login_en,
      forgot_password: forgot_password_en,
      footer: footer_en,
      change_password: change_password_en,
      user_home: user_home_en,
    },
    tl: {
      global: global_tl,
      landing_page: landing_page_tl,
      announcements: announcements_tl,
      education_and_awareness: education_and_awareness_tl,
      about_us: about_us_tl,
      contact_us: contact_us_tl,
      register: register_tl,
      form: form_tl,
      profile: profile_tl,
      redeem_rewards: redeem_rewards_tl,
      header: header_tl,
      analytics: analytics_tl,
      login: login_tl,
      forgot_password: forgot_password_tl,
      footer: footer_tl,
      change_password: change_password_tl,
      user_home: user_home_tl,
    },
  },
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  debug: true,
});
