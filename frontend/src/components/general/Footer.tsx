import { MapPin, Mail, Phone } from "lucide-react";
import BarangaySilanganLogo from "../logo/BarangaySilanganLogo";
import BazerowLogo from "../logo/BazerowLogo";
import FacebookLogo from "@/assets/facebook_logo.png";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("footer");

  return (
    <footer className="bg-secondary-dark text-white/80">
      <div className="max-w-screen-xl mx-auto px-20 max-lg:px-10 max-sm:px-6 py-16 max-md:py-12">
        <div className="grid grid-cols-4 gap-12 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {/* About Section */}
          <div className="col-span-2 max-lg:col-span-2 max-sm:col-span-1">
            <h3 className="font-semibold text-lg text-white mb-4">
              {t("more_information")}
            </h3>
            <p className="text-sm leading-relaxed mb-6 max-w-md">{t("subtext")}</p>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <BarangaySilanganLogo />
                <span className="text-sm font-medium text-white">
                  BRGY. BAGONG SILANGAN, QC
                </span>
              </div>
              <div className="flex items-center gap-3">
                <BazerowLogo />
                <div className="text-sm">
                  <p className="text-white/60">WILFREDO L. CARA</p>
                  <p className="font-medium text-white">Punong Barangay</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-semibold text-lg text-white mb-4">
              Contact
            </h3>
            <ul className="flex flex-col gap-4 text-sm">
              <li>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 hover:text-white transition-colors"
                  href="https://maps.app.goo.gl/eaaKtQ6t4ezupMWk8"
                >
                  <MapPin size={18} className="flex-shrink-0 mt-0.5 text-primary-main-light" />
                  <span>A. Bonifacio St. Bagong Silangan 1119 Quezon City</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="flex-shrink-0 mt-0.5 text-primary-main-light" />
                <span>(02) 856-456-47</span>
              </li>
              <li>
                <a
                  href="mailto:barangaybagongsilangan123@gmail.com"
                  className="flex items-start gap-3 hover:text-white transition-colors"
                >
                  <Mail size={18} className="flex-shrink-0 mt-0.5 text-primary-main-light" />
                  <span className="break-all">barangaybagongsilangan123@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social Section */}
          <div>
            <h3 className="font-semibold text-lg text-white mb-4">
              {t("keep_connected")}
            </h3>
            <a
              className="inline-flex items-center gap-3 text-sm hover:text-white transition-colors"
              href="https://www.facebook.com/brgybagongsilanganqc"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 p-2">
                <img
                  src={FacebookLogo}
                  alt="Facebook"
                  className="w-full h-full object-contain"
                />
              </div>
              <span>Follow us on Facebook</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-screen-xl mx-auto px-20 max-lg:px-10 max-sm:px-6 py-6">
          <div className="flex items-center justify-between gap-4 text-sm text-white/50 max-sm:flex-col max-sm:text-center">
            <span>© {new Date().getFullYear()} Rise to Rice. All rights reserved</span>
            <span>Developed by SMAQ Solutions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
