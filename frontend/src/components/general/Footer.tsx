import { Home, MailIcon, Phone } from "lucide-react";
import BarangaySilanganLogo from "../logo/BarangaySilanganLogo";
import BazerowLogo from "../logo/BazerowLogo";
import FacebookLogo from "@/assets/facebook_logo.png";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("footer");

  return (
    <footer className="bg-primary-main-dark text-secondary-light/50">
      <div className="max-lg:text-sm p-8 flex justify-between z-50 px-20 gap-10 max-xl:flex-col max-xl:px-14  max-md:px-10 max-sm:px-6">
        <div className="flex flex-col gap-4 w-1/2 max-xl:w-full max-xl:flex-row max-xl:gap-10 max-sm:flex-col">
          <div className="flex flex-col gap-6 max-xl:w-1/2 max-sm:w-full">
            <p className="font-semibold text-xl text-secondary-light">
              {t("more_information")}
            </p>
            <p>{t("subtext")}</p>
          </div>

          <div className="flex flex-col gap-4 max-xl:grow">
            <span className="flex items-center gap-4">
              <span>
                <BarangaySilanganLogo />
              </span>
              <p className="font-semibold text-lg max-lg:text-sm mb-1">
                BRGY. BAGONG SILANGAN, QUEZON CITY
              </p>
            </span>
            <span className="flex gap-4 items-center">
              <span>
                <BazerowLogo />
              </span>
              <span>
                <p>WILFREDO L. CARA</p>
                <p className="font-semibold">Punong Barangay</p>
              </span>
            </span>
          </div>
        </div>
        <div className="flex justify-between w-1/2 gap-10 max-xl:w-full max-sm:flex-col">
          <div className="flex flex-col gap-6 min-w-fit">
            <p className="font-semibold text-xl text-secondary-light">
              {t("more_information")}
            </p>
            <ul className="flex flex-col gap-4 max-w-[300px]">
              <li>
                <a
                  target="_blank"
                  className="flex items-start gap-2"
                  href="https://maps.app.goo.gl/eaaKtQ6t4ezupMWk8"
                >
                  <div>
                    <Home size={20} />
                  </div>
                  <p className="-mt-1">
                    A. Bonifacio St. Bagong Silangan 1119 Quezon City,
                    Philippines
                  </p>
                </a>
              </li>
              <li className="flex items-start gap-2">
                <div>
                  <Phone size={20} />
                </div>
                <p className="-mt-1">
                  Hotlines: BHERT -(02 856-456-47) / 09515157591 : BPSO - (02)
                  82831259 CCTV - (02) 8260-73-40
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div>
                  <MailIcon size={20} />
                </div>
                <a
                  href="mailto:barangaybagongsilangan123@gmail.com"
                  className="-mt-1"
                >
                  barangaybagongsilangan123@gmail.com
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <p className="font-semibold text-xl text-secondary-light">
              {t("keep_connected")}
            </p>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  className="flex items-center gap-2"
                  href="https://www.facebook.com/brgybagongsilanganqc"
                  target="_blank"
                >
                  <div className="w-8 h-8 rounded-full">
                    <img
                      src={FacebookLogo}
                      alt="Facebook"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p>Like us on Facebook</p>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-secondary-dark/50 px-20 max-md:px-10 max-md:text-sm">
        <span className="flex items-center justify-center gap-1 py-4 max-sm:flex-col">
          © {new Date().getFullYear()} Rise to Rice. All rights reserved
          <span className="max-sm:hidden">|</span>
          <span>Developed by SMAQ Solutions</span>
        </span>
      </div>
    </footer>
  );
}
