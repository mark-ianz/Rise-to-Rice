import { MapPin, Mail, Phone, Facebook } from "lucide-react";
import BarangaySilanganLogo from "../logo/BarangaySilanganLogo";
import BazerowLogo from "../logo/BazerowLogo";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useFullUserContext from "@/hooks/useFullUserContext";

export default function Footer() {
  const { t } = useTranslation("footer");
  const { state } = useFullUserContext();
  const isAuth = !!state.account_id;
  const isAdmin = state.role === "admin";

  return (
    <footer className="bg-secondary-dark text-white/70 border-t border-white/5 relative overflow-hidden">
      {/* Decorative top green accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-main-light via-primary-main to-primary-main-dark opacity-80" />

      <div className="max-w-screen-xl mx-auto px-20 max-lg:px-10 max-sm:px-6 py-20 max-md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Brand Info & Logos Section - lg:col-span-4 */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary-main-light">
                {t("more_information")}
              </h4>
              <p className="text-sm leading-relaxed text-white/50 mt-3 max-w-sm">
                {t("subtext")}
              </p>
            </div>

            {/* Official Barangay Partnership Logos */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-3">
                <BarangaySilanganLogo />
                <div className="text-xs text-left">
                  <p className="text-white/40 uppercase tracking-widest font-bold text-[9px]">
                    Rise to Rice Partner
                  </p>
                  <p className="text-white font-extrabold tracking-tight">
                    BRGY. BAGONG SILANGAN, QC
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BazerowLogo />
                <div className="text-xs text-left">
                  <p className="text-white/40 uppercase tracking-widest font-bold text-[9px]">
                    Punong Barangay
                  </p>
                  <p className="text-white font-extrabold tracking-tight">
                    WILFREDO L. CARA
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links Column - lg:col-span-2 */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary-main-light">
              {t("quick_links")}
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  to="/"
                  className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/15 group-hover:bg-primary-main-light transition-colors" />
                  <span>{t("home")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/15 group-hover:bg-primary-main-light transition-colors" />
                  <span>{t("about")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/announcements"
                  className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/15 group-hover:bg-primary-main-light transition-colors" />
                  <span>{t("announcements")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/15 group-hover:bg-primary-main-light transition-colors" />
                  <span>{t("contact_us")}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Dynamic Access Column - lg:col-span-3 */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary-main-light">
              {t("legal_support")}
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/15 group-hover:bg-primary-main-light transition-colors" />
                  <span>{t("terms")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/15 group-hover:bg-primary-main-light transition-colors" />
                  <span>{t("privacy")}</span>
                </Link>
              </li>

              {/* Context-aware dynamic navigation routes */}
              {isAuth ? (
                <>
                  <li>
                    <Link
                      to="/profile"
                      className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/15 group-hover:bg-primary-main-light transition-colors" />
                      <span>Profile</span>
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link
                        to="/dashboard"
                        className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white/15 group-hover:bg-primary-main-light transition-colors" />
                        <span className="text-primary-main-light font-semibold">Admin Dashboard</span>
                      </Link>
                    </li>
                  )}
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/15 group-hover:bg-primary-main-light transition-colors" />
                      <span>{t("login")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/15 group-hover:bg-primary-main-light transition-colors" />
                      <span>{t("register")}</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact Section Column - lg:col-span-3 */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary-main-light">
              {t("contact_information")}
            </h4>
            <ul className="flex flex-col gap-3.5">
              <li>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 hover:text-white transition-colors duration-200 group"
                  href="https://maps.app.goo.gl/eaaKtQ6t4ezupMWk8"
                >
                  <MapPin size={16} className="mt-0.5 text-primary-main-light shrink-0 transition-transform group-hover:scale-110" />
                  <span className="text-sm leading-tight text-white/60 group-hover:text-white">
                    A. Bonifacio St. Bagong Silangan, QC
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:0285645647"
                  className="flex items-center gap-2.5 hover:text-white transition-colors duration-200 group"
                >
                  <Phone size={16} className="text-primary-main-light shrink-0 transition-transform group-hover:scale-110" />
                  <span className="text-sm text-white/60 group-hover:text-white">
                    (02) 856-456-47
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:barangaybagongsilangan123@gmail.com"
                  className="flex items-start gap-2.5 hover:text-white transition-colors duration-200 group"
                >
                  <Mail size={16} className="mt-0.5 text-primary-main-light shrink-0 transition-transform group-hover:scale-110" />
                  <span className="text-sm break-all text-white/60 group-hover:text-white leading-none">
                    barangaybagongsilangan123@gmail.com
                  </span>
                </a>
              </li>
            </ul>

            {/* Keeping Connected Social Badge */}
            <div className="mt-2">
              <a
                className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 py-2 px-3.5 rounded-xl text-sm font-semibold hover:text-white shadow-sm"
                href="https://www.facebook.com/brgybagongsilanganqc"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={16} className="text-primary-main-light" />
                <span>{t("keep_connected")}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-white/5 bg-black/10">
        <div className="max-w-screen-xl mx-auto px-20 max-lg:px-10 max-sm:px-6 py-6">
          <div className="flex items-center justify-between gap-4 text-xs text-white/40 max-sm:flex-col max-sm:text-center">
            <span>
              © {new Date().getFullYear()} Rise to Rice. All rights reserved.
            </span>
            <span className="tracking-wide">
              Developed by{" "}
              <span className="text-white/60 font-semibold hover:text-primary-main-light transition-colors cursor-default">
                SMAQ Solutions
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

