import SectionWrapper from "@/components/general/SectionWrapper";
import { useParams, Link } from "react-router-dom";
import { useGetExchangeLogByNanoId } from "@/hooks/query/useUserActivity";
import GenericError from "@/components/general/GenericError";
import WholePageLoader from "@/components/general/WholePageLoader";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft, Recycle, Calendar, Scale, Coins, User, Copy, Check, Mail, Phone,
  ShieldCheck, FileText, ZoomIn, Leaf, Sparkles
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function ActivityHistoryExchange() {
  const { id } = useParams();
  const { t } = useTranslation("redeem_rewards");
  const { data: request, isLoading, isError } = useGetExchangeLogByNanoId(id);
  const [copied, setCopied] = useState(false);

  if (isLoading) return <WholePageLoader />;
  if (isError || !request) return <GenericError />;

  const getInitials = (first?: string, last?: string) => {
    return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase() || "ST";
  };

  const getEcoImpact = (material: string, weight: number) => {
    const materialLower = material?.toLowerCase() || "";
    let factor = 1.5; // default co2 kg saved per kg
    if (materialLower.includes("plastic")) factor = 1.7;
    else if (materialLower.includes("metal") || materialLower.includes("can") || materialLower.includes("tin")) factor = 3.2;
    else if (materialLower.includes("paper") || materialLower.includes("carton")) factor = 0.9;
    else if (materialLower.includes("glass")) factor = 0.5;
    return (weight * factor).toFixed(2);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(request.exchange_log_id?.toString() || "");
    setCopied(true);
    toast.success("Exchange ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SectionWrapper id="activity-history-exchange" className="px-20 py-10 justify-center items-center max-md:px-10 max-sm:px-6">
      <Helmet>
        <title>{t("activity_history.exchange_details")} | Rise to Rice</title>
      </Helmet>

      {/* Embedded Scoped Print Style Sheet Overrides */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body {
            background: white !important;
            color: #1e293b !important;
          }
          nav, header, footer, button, a, .no-print {
            display: none !important;
          }
          #activity-history-exchange {
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
            width: 100% !important;
          }
          .print-receipt-wrapper {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .print-receipt-card {
            border: 2px dashed #94a3b8 !important;
            box-shadow: none !important;
            border-radius: 16px !important;
            padding: 32px !important;
            background: white !important;
          }
          .print-badge {
            border: 1px solid currentColor !important;
            background: transparent !important;
            color: black !important;
          }
        }
      `}} />

      {/* Desktop Layout - Hidden on Print */}
      <div className="max-w-screen-md w-full print:hidden">
        <div className="flex justify-between items-center mb-6 no-print">
          <Link
            to="/activity-history"
            className="group inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary-main transition-colors"
          >
            <ArrowLeft size={16} className="mr-2 transform group-hover:-translate-x-1.5 transition-transform duration-300" />
            {t("activity_history.back_to_history")}
          </Link>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-secondary-dark border border-warm-tan/30 rounded-full px-3.5 py-1.5 bg-warm-cream/10 hover:bg-warm-cream/50 transition-colors shadow-sm select-none cursor-pointer max-sm:hidden"
          >
            <FileText size={13} />
            Print Receipt
          </button>
        </div>

        <div className="relative overflow-hidden bg-white rounded-[32px] p-6 md:p-10 border border-warm-tan/20 shadow-[0_20px_60px_rgba(0,0,0,0.03)] print-receipt-card">
          {/* Decorative ambient background glows - hidden in print */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-green-100/25 to-transparent rounded-full blur-3xl pointer-events-none no-print" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-warm-cream/40 to-transparent rounded-full blur-3xl pointer-events-none no-print" />
          <div className="absolute right-10 bottom-10 w-32 h-32 bg-emerald-500/5 rounded-full pointer-events-none blur-xl select-none no-print" />
          <div className="absolute left-10 top-24 w-20 h-20 bg-green-500/5 rounded-full pointer-events-none blur-lg select-none no-print" />

          {/* Header block */}
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-8 border-b border-warm-tan/10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100/40 flex items-center justify-center border border-green-200/50 shadow-inner shrink-0 group cursor-pointer hover:scale-105 hover:shadow transition-all duration-300 no-print">
                <Recycle className="text-primary-main group-hover:rotate-180 transition-transform duration-700 ease-out" size={30} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-green-700 bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-full print-badge">
                    {t("activity_history.material_exchange")}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-secondary-dark mt-1 tracking-tight">{request.material}</h1>
                <p className="text-muted-foreground/80 flex items-center mt-1 text-sm">
                  <Calendar size={14} className="mr-1.5 text-warm-tan" />
                  {format(new Date(request.timestamp), "MMMM dd, yyyy - hh:mm a")}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0 self-stretch md:self-auto border-t md:border-t-0 pt-4 md:pt-0 border-warm-tan/10">
              <div className="bg-emerald-50 text-emerald-700 border border-emerald-100/50 px-4 py-2 rounded-2xl text-lg font-bold flex items-center gap-2 shadow-sm hover:scale-[1.03] transition-all select-none print-badge">
                <Coins size={18} className="text-emerald-600 animate-pulse no-print" />
                +{request.points_added} pts
              </div>
              <button
                onClick={handleCopyId}
                className="group/copy flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-secondary-dark transition-colors cursor-pointer no-print"
                title="Copy Exchange ID"
              >
                <span className="font-mono">ID: #{request.exchange_log_id}</span>
                {copied ? (
                  <Check size={12} className="text-emerald-600 scale-110 transition-transform" />
                ) : (
                  <Copy size={12} className="group-hover/copy:scale-110 transition-transform" />
                )}
              </button>
              {/* For print layout show plain ID */}
              <span className="hidden print:inline font-mono text-xs text-muted-foreground">ID: #{request.exchange_log_id}</span>
            </div>
          </div>

          {/* Interactive Metrics Grid - 4-Card layout */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Weight card */}
            <div className="bg-warm-cream/40 p-5 rounded-2xl border border-warm-tan/10 hover:border-warm-tan/50 hover:bg-warm-cream/60 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-default">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider">{t("activity_history.weight")}</span>
                <div className="w-8 h-8 rounded-lg bg-warm-cream flex items-center justify-center text-warm-tan border border-warm-tan/10 group-hover:scale-110 transition-transform no-print">
                  <Scale size={16} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-secondary-dark">{request.weight}</span>
                <span className="text-sm font-bold text-secondary-dark/60 ml-1">kg</span>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">Diverted from landfill</p>
              </div>
            </div>

            {/* Points card */}
            <div className="bg-green-50/20 p-5 rounded-2xl border border-green-100/40 hover:border-green-300 hover:bg-green-50/40 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-default">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold text-green-700/80 uppercase tracking-wider">{t("activity_history.points_added")}</span>
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 border border-green-100/50 group-hover:scale-110 transition-transform no-print">
                  <Coins size={16} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-green-700">+{request.points_added}</span>
                <p className="text-[10px] text-green-600/60 mt-0.5">Credited to wallet</p>
              </div>
            </div>

            {/* Carbon Offset Impact Card */}
            <div className="bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100/50 hover:border-emerald-300 hover:bg-emerald-50/50 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-default shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">CO₂ Saved</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-200/50 group-hover:scale-110 transition-transform no-print">
                  <Leaf size={16} className="animate-pulse" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-emerald-700">{getEcoImpact(request.material, request.weight)}</span>
                <span className="text-sm font-bold text-emerald-700/60 ml-1">kg</span>
                <p className="text-[10px] text-emerald-600/70 mt-0.5">Est. carbon offset</p>
              </div>
            </div>

            {/* Logged by card */}
            <div className="bg-slate-50/30 p-5 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/50 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-default">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider">{t("activity_history.logged_by")}</span>
                <div className="w-8 h-8 rounded-full bg-primary-main/10 flex items-center justify-center text-primary-main font-bold text-xs group-hover:scale-110 transition-transform no-print">
                  {getInitials(request.logged_by_first_name, request.logged_by_last_name)}
                </div>
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold text-secondary-dark truncate block leading-tight">
                  {request.logged_by_first_name} {request.logged_by_last_name}
                </span>
                <p className="text-[10px] text-muted-foreground/60 mt-1">Eco-Collector</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start relative z-10">
            {/* Resident details and logging confirmation */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Resident Information</h3>
                <div className="bg-warm-beige/25 p-5 rounded-2xl border border-warm-tan/10 space-y-4 shadow-inner">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-warm-cream border border-warm-tan/20 flex items-center justify-center text-secondary-dark shrink-0">
                      <User size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Recycler Name</span>
                      <p className="font-semibold text-secondary-dark text-sm leading-tight mt-0.5">{request.first_name} {request.last_name}</p>
                    </div>
                  </div>

                  {request.email && (
                    <div className="flex items-center gap-3 border-t border-warm-tan/10 pt-3">
                      <div className="w-10 h-10 rounded-full bg-warm-cream border border-warm-tan/20 flex items-center justify-center text-secondary-dark shrink-0">
                        <Mail size={18} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Email Address</span>
                        <p className="font-medium text-secondary-dark text-sm truncate leading-tight mt-0.5">{request.email}</p>
                      </div>
                    </div>
                  )}

                  {request.contact_number && (
                    <div className="flex items-center gap-3 border-t border-warm-tan/10 pt-3">
                      <div className="w-10 h-10 rounded-full bg-warm-cream border border-warm-tan/20 flex items-center justify-center text-secondary-dark shrink-0">
                        <Phone size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Contact Number</span>
                        <p className="font-semibold text-secondary-dark text-sm leading-tight mt-0.5">{request.contact_number}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-emerald-50/20 border border-green-200/30 p-4 rounded-2xl flex items-start gap-3 shadow-sm no-print">
                <ShieldCheck className="text-green-600 shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-green-800 font-medium leading-normal">
                  This transaction is fully secure, verified, and has been permanently recorded in the ecological database.
                </p>
              </div>
            </div>

            {/* Proof of Exchange */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">{t("activity_history.proof_of_exchange")}</h3>
                {request.image_url ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="group bg-white p-3 rounded-2xl border border-warm-tan/20 shadow-md aspect-video relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer">
                        <div className="w-full h-full rounded-xl overflow-hidden relative">
                          <img
                            src={request.image_url}
                            alt="Exchange Proof"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-secondary-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white gap-2 font-semibold text-xs rounded-xl no-print">
                            <ZoomIn size={18} />
                            Click to Expand
                          </div>
                          <div className="absolute top-2 right-2 bg-secondary-dark/70 text-white backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
                            Verified Photo
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-md rounded-[24px] border-none shadow-2xl p-4 overflow-hidden">
                      <div className="w-full rounded-2xl overflow-hidden shadow-inner border border-warm-tan/10">
                        <img
                          src={request.image_url}
                          alt="Full Exchange Proof"
                          className="w-full h-auto object-contain max-h-[80vh] mx-auto rounded-xl"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-warm-tan/30 bg-warm-beige/5 p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-warm-cream/50 flex items-center justify-center mb-3">
                      <Recycle className="text-warm-tan/60 animate-none" size={24} />
                    </div>
                    <p className="text-secondary-dark font-semibold text-sm mb-1">{t("activity_history.no_image_provided")}</p>
                    <p className="text-[11px] text-muted-foreground/80 max-w-[200px]">Waste drops logged without image proofs are verified manually by collectors.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Decorative receipt accent */}
          <div className="mt-8 pt-6 border-t border-dashed border-warm-tan/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/60 no-print">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px]">VERIFIED TRANSACTION</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Official Eco-Receipt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Receipt Print-Only Layout */}
      <div className="hidden print:block max-w-xs mx-auto p-6 border-2 border-dashed border-slate-300 rounded-2xl text-[10px] font-mono bg-white leading-relaxed text-slate-800">
        <div className="text-center mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider">RISE TO RICE</h2>
          <p className="text-[8px] text-slate-500">Barangay Ecological Center</p>
          <div className="border-t border-dashed border-slate-300 my-2"></div>
          <p className="font-bold text-[9px] uppercase">MATERIAL EXCHANGE RECEIPT</p>
        </div>

        <div className="space-y-1 mb-4">
          <div className="flex justify-between">
            <span>RECEIPT ID:</span>
            <span className="font-bold">#{request.exchange_log_id}</span>
          </div>
          <div className="flex justify-between">
            <span>DATE:</span>
            <span>{format(new Date(request.timestamp), "yyyy-MM-dd hh:mm a")}</span>
          </div>
          <div className="flex justify-between">
            <span>RESIDENT:</span>
            <span className="font-semibold uppercase">{request.first_name} {request.last_name}</span>
          </div>
          {request.contact_number && (
            <div className="flex justify-between">
              <span>CONTACT:</span>
              <span>{request.contact_number}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>COLLECTOR:</span>
            <span className="uppercase">{request.logged_by_first_name} {request.logged_by_last_name}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-slate-300 my-2"></div>

        {/* Itemized Table */}
        <div className="space-y-1.5 py-1">
          <div className="flex justify-between font-bold">
            <span>MATERIAL TYPE</span>
            <span>QTY/WT</span>
          </div>
          <div className="flex justify-between">
            <span className="uppercase">{request.material}</span>
            <span>{request.weight} kg</span>
          </div>
        </div>

        <div className="border-t border-dashed border-slate-300 my-2"></div>

        {/* Totals */}
        <div className="space-y-1 py-1">
          <div className="flex justify-between text-xs font-bold">
            <span>POINTS EARNED:</span>
            <span>+{request.points_added} PTS</span>
          </div>
          <div className="flex justify-between text-[9px] text-emerald-700 font-semibold">
            <span>EST. CO₂ SAVED:</span>
            <span>{getEcoImpact(request.material, request.weight)} KG</span>
          </div>
        </div>

        <div className="border-t border-dashed border-slate-300 my-3"></div>

        <div className="text-center space-y-1">
          <p className="font-bold text-emerald-600">✓ TRANSACTION VERIFIED</p>
          <p className="text-[8px] text-slate-500">Thank you for recycling with us!</p>
          <div className="mt-3 flex justify-center opacity-70">
            <div className="h-6 w-28 bg-[repeating-linear-gradient(90deg,currentColor,currentColor_2px,transparent_2px,transparent_4px)]" />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
