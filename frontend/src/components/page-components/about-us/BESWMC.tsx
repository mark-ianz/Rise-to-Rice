import SectionWrapper from "@/components/general/SectionWrapper";
import BarangaySilanganLogo from "@/components/logo/BarangaySilanganLogo";
import BazerowLogo from "@/components/logo/BazerowLogo";
import LungsodQuezonCityLogo from "@/components/logo/LungsodQuezonCityLogo";
import { Separator } from "@/components/ui/separator";
import KeyValuePair from "../view_profile/analytics/KeyValuePair";
import DSQCLogo from "@/components/logo/DSQCLogo";

export default function BESWMC() {
  return (
    <SectionWrapper
      id="BESWMC"
      className="px-20 py-10 flex-col bg-secondary-light/50 max-lg:px-6 max-sm:px-4 items-center justify-start"
    >
      <div className="max-w-screen-lg w-full flex flex-col gap-10">
        <div className="p-10 pb-40 border max-md:px-6 max-md:pb-32 max-sm:pb-20 bg-white flex flex-col items-center gap-6">
          <div id="header" className="w-full">
            <div className="flex items-center w-full">
              <div className="grid grid-cols-2 items-center gap-4 max-sm:flex max-sm:flex-col">
                <LungsodQuezonCityLogo containerClass="w-28 max-lg:w-20 max-md:w-16 max-sm:w-12" />
                <BarangaySilanganLogo containerClass="w-28 max-lg:w-20 max-md:w-16 max-sm:w-12" />
              </div>
              <div className="grow flex flex-col justify-center items-center text-center">
                <p className="text-sm max-md:text-xs">
                  Republic of the Philippines
                </p>
                <p className="text-lg font-semibold text-destructive max-lg:text-base max-md:text-sm">
                  BARANGAY BAGONG SILANGAN
                </p>
                <p className="text-sm max-md:text-xs">
                  District II, Quezon City, Manila
                </p>
                <p className="font-roboto text-2xl font-bold max-lg:text-lg max-md:text-base">
                  SANGGUNIANG BARANGAY
                </p>
              </div>
              <div className="grid grid-cols-2 max-sm:grid-cols-1">
                <BazerowLogo containerClass="w-28 max-lg:w-20 max-md:w-16 max-sm:w-12" />
              </div>
            </div>
            <p className="text-end italic font-semibold max-md:text-sm max-sm:text-xs max-sm:mt-2">
              "Public Office is a Public Trust"
            </p>
          </div>
          <Separator className="bg-orange-600 h-1" />
          <div className="text-lg flex flex-col items-center text-center gap-4 w-full max-w-screen-md">
            <div className="flex flex-col items-center gap-2 max-md:text-sm">
              <p className="font-serif">
                ADOPTING AND IMPLEMENTING THE RECYCLABLES ITEMS FOR <br />
                SWAP/EXCHANGE (RISE) FOR RICE <br /> RESOLUTION No.005 <br />{" "}
                Series of 2004
              </p>
              <p className="font-serif">
                BARANGAY ECOLOGICAL SOLID WASTE MANAGEMENT COMMITTEE <br />{" "}
                (BESWMC)
              </p>
            </div>
            <Separator className="bg-black" />
            <Separator className="bg-black" />
            <div className="flex flex-col gap-6 text-justify mt-2 max-md:text-sm">
              <p className="font-serif">
                A resolution by the Committee adopting and implementing the
                recyclables items for swap/exchange (Rise) for rice (herein
                referred as RiceforRice) as one of the Solid Waste Management
                (SWM) program, participated by the SWM employees to intensify,
                enhance and complement the efficiency and effectiveness of
                existing recycling program.
              </p>
              <p className="font-serif">
                <span className="font-semibold font-serif">WHEREAS,</span> the
                Solid Waste Management (SWM) is seriously implementing and
                enforcing the recycling and segregation provision of RA 9003 and
                the QC Environmental Code Ordinance Z350 s2014;
              </p>
              <p className="font-serif">
                <span className="font-semibold font-serif">WHEREAS,</span> the
                Solid Waste Management (SWM) support and believes that thru
                incentive/rewards, the segregation and recycling activities is
                enhanced and more effective and will increase the waste
                diversion volume;
              </p>
              <p className="font-serif">
                <span className="font-semibold font-serif">WHEREAS,</span> the
                BESWM Committee will continue to innovate and develop more
                strategies/approaches to reduce the recycling materials;
              </p>
              <p className="font-serif">
                <span className="font-semibold font-serif">WHEREAS,</span> the
                RiceforRice program encourages the SWM employees to collect and
                save recyclable items on daily basis during their sweeping and
                other activities and immediately swap/exchange this for goods
                like rice, canned goods, and other food commodities;
              </p>
              <p className="font-serif">
                <span className="font-semibold font-serif">NOW THEREFORE,</span>{" "}
                on motion of committee member, kgd. GERRY TOLEDO, and seconded
                by fellow committee member MARISSA D. PADREQUILLA the BESWMC
                hereby RESOLVED to adopt and implement the recyclable items for
                swap/exchange (Rise) for Rice (herein referred as RiceforRice)
                as one of the Solid Waste Management (SWM) program participated
                by SWM employees to intensify, enhance and compliment the
                efficiency and effectiveness of existing recycling;
              </p>
              <p className="font-serif">
                <span className="font-semibold font-serif">
                  RESOLVED FURTHER,
                </span>{" "}
                that the current Material Recovery Facility (MRF) at Greenland
                area shall be renovated and repaired and shall be used as
                sorting, recovery and storage for the RiceforRice program;
              </p>
              <p className="font-serif">
                <span className="font-semibold font-serif">
                  RESOLVED FINALLY,
                </span>{" "}
                that copies of this committee resolution be furnished to
                concerned parties,
              </p>
              <p className="font-serif">
                this{" "}
                <span className="font-serif font-semibold">
                  18<sup className="font-serif">th</sup> day of, 2024
                </span>{" "}
                during the BESWM Committee Quarterly meeting at Barangay Bagong
                Silangan Hall.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-white border p-10 max-md:px-6">
          <div className="flex flex-col gap-4 max-w-screen-md">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-10 max-md:gap-6 max-sm:gap-4">
                <LungsodQuezonCityLogo containerClass="w-28 max-lg:w-20 max-md:w-16" />
                <span className="text-center">
                  <p className="text-primary-main text-2xl font-bold max-md:text-lg max-sm:text-base">
                    Q.C ENVIRONMENTAL CODE
                  </p>
                  <p className="font-serif max-md:text-sm max-sm:text-xs">
                    ORDINANCE NO. SP 2350, S-2014
                  </p>
                  <p className="text-lg font-semibold mt-2 max-md:text-base max-sm:text-sm">
                    PROHIBITED ACTS
                  </p>
                </span>
                <DSQCLogo containerClass="w-28 max-lg:w-20 max-md:w-16" />
              </div>
            </div>

            <Separator className="bg-black" />
            <Separator className="bg-black" />

            <div className="grid grid-cols-2 gap-3 mt-4 max-md:text-sm">
              <KeyValuePair headClassName="max-md:text-xs" head="SEC.2">
                DIRTY PREMISES
              </KeyValuePair>
              <KeyValuePair headClassName="max-md:text-xs" head="SEC. 3">
                EXCESSIVE NOISE
              </KeyValuePair>
              <KeyValuePair headClassName="max-md:text-xs" head="SEC. 2B">
                FOUL ODOR FROM MOTOR VEHICLE
              </KeyValuePair>
              <KeyValuePair headClassName="max-md:text-xs" head="SEC. 2C">
                FOUL ODOR FROM RESIDENCE OR BUSINESS
              </KeyValuePair>
              <KeyValuePair headClassName="max-md:text-xs" head="SEC. 2D">
                OBSTRUCTION
              </KeyValuePair>
              <KeyValuePair headClassName="max-md:text-xs" head="SEC. 2F">
                ILLEGAL PENS AND CAGES
              </KeyValuePair>
              <KeyValuePair headClassName="max-md:text-xs" head="SEC. 2K">
                ANIMAL EXCRETA
              </KeyValuePair>
              <KeyValuePair headClassName="max-md:text-xs" head="SEC. 3A">
                DIRTY VACANT SLOT
              </KeyValuePair>
              <KeyValuePair headClassName="max-md:text-xs" head="SEC. 3B">
                GARBAGE ON VACANT SLOT
              </KeyValuePair>
              <KeyValuePair headClassName="max-md:text-xs" head="SEC. 4A">
                NON-SEGREGATION OF WASTE AT SOURCE
              </KeyValuePair>
              <KeyValuePair headClassName="max-md:text-xs" head="SEC. 4B">
                NO SEPARATE GARBAGE BINS
              </KeyValuePair>
              <KeyValuePair headClassName="max-md:text-xs" head="SEC. 4C">
                NO PROPER GARBAGE STORAGE AREA
              </KeyValuePair>
              <KeyValuePair headClassName="max-md:text-xs" head="SEC. 9A">
                LITTERING / ILLEGAL DUMPING
              </KeyValuePair>
              <KeyValuePair headClassName="max-md:text-xs" head="SEC. 9B">
                ILLEGAL STORING OF GARBAGE
              </KeyValuePair>
              <KeyValuePair headClassName="max-md:text-xs" head="SEC. 10">
                OPEN BURNING
              </KeyValuePair>
              <KeyValuePair headClassName="max-md:text-xs" head="SEC. 11">
                URINATING / SPITTING “SINGA” / DEFECATING
              </KeyValuePair>
              <KeyValuePair headClassName="max-md:text-xs" head="SEC. 12D">
                NO SEPTIC TANK
              </KeyValuePair>
              <KeyValuePair headClassName="max-md:text-xs" head="SEC. 14F">
                <span>
                  <p>NOT CHARGING P2 PLASTIC BAG</p>
                  <ul className="list-disc pl-8">
                    <li>NON-SUBMISSION OF ANNUAL AUDITED FINANCIAL REPORT</li>
                    <li>NON-SUBMISSION OF QUARTERLY REPORT</li>
                  </ul>
                </span>
              </KeyValuePair>
              <KeyValuePair headClassName="max-md:text-xs" head="SEC. D">
                VENDORS UTILIZING PLASTIC BAG AS PACKAGING CONTAINER FOR FOOD
                AND DRINKS
              </KeyValuePair>
              <KeyValuePair headClassName="max-md:text-xs" head="SEC. 15F">
                SERVING FOOD AND DRINKS ON A PLASTIC BAG OR STYRO DURING
                MEETINGS AND OTHER ACTIVITIES WITHIN GOVERNMENT INST.
              </KeyValuePair>
            </div>
          </div>
          <span className="text-sm h-40 flex w-full items-start flex-col justify-end max-md:text-xs">
            Read more:
            <a
              className="text-tertiary underline break-all"
              target="_blank"
              href="https://www.officialgazette.gov.ph/2001/01/26/republic-act-no-9003-s-2001/"
            >
              https://www.officialgazette.gov.ph/2001/01/26/republic-act-no-9003-s-2001/
            </a>
          </span>
        </div>

        <div className="flex flex-col items-center justify-center bg-white border p-10 max-md:px-6">
          <div className="w-full flex flex-col gap-4 max-w-screen-md">
            <span>
              <p className="text-3xl font-bold max-lg:text-2xl max-md:text-xl">
                Republic Act No. 9003
              </p>
              <p className="text-tertiary text-sm max-md:text-xs">
                January 26, 2001
              </p>
            </span>
            <Separator />
            <div className="flex flex-col items-center justify-center font-semibold text-center gap-6 max-md:text-sm">
              <span>
                <p className="text-lg max-md:text-base">
                  REPUBLIC OF THE PHILIPPINES
                </p>
                <p>Congress of the Philippines</p>
              </span>
              <p>Metro Manila</p>
              <p>REPUBLIC ACT NO. 9003</p>
              <span>
                AN ACT PROVIDING FOR AN ECOLOGICAL SOLID WASTE MANAGEMENT
                PROGRAM, CREATING THE NECESSARY INSTITUTIONAL MECHANISMS AND
                INCENTIVES, DECLARING CERTAIN ACTS PROHIBITED AND PROVIDING
                PENALTIES, APPROPRIATING FUNDS THEREFOR, AND FOR OTHER PURPOSES
              </span>
            </div>
          </div>
          <span className="text-sm h-40 flex w-full items-start flex-col justify-end max-md:text-xs">
            Read more:
            <a
              className="text-tertiary underline break-all"
              target="_blank"
              href="https://www.officialgazette.gov.ph/2001/01/26/republic-act-no-9003-s-2001/"
            >
              https://www.officialgazette.gov.ph/2001/01/26/republic-act-no-9003-s-2001/
            </a>
          </span>
        </div>
      </div>
    </SectionWrapper>
  );
}
