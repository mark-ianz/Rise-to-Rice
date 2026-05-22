import SectionWrapper from "@/components/general/SectionWrapper";
import { useParams, Link } from "react-router-dom";
import { useGetRedeemRequestByNanoId } from "@/hooks/query/useUserActivity";
import GenericError from "@/components/general/GenericError";
import WholePageLoader from "@/components/general/WholePageLoader";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { 
  ArrowLeft, Package, Clock, Calendar, CheckCircle2, XCircle, AlertCircle, 
  Loader2, Copy, User, Phone, MessageSquare, Sparkles, RefreshCw, Check, 
  ShoppingBag, Coins, FileText, ZoomIn, Mail
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { capitalizeWordStart } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export default function ActivityHistoryRedeem() {
  const { id } = useParams();
  const { t } = useTranslation("redeem_rewards");
  const { data: request, isLoading, isError } = useGetRedeemRequestByNanoId(id);
  const [cancelReason, setCancelReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: async (reason: string) => {
      const res = await axios.put(`/api/redeem-request/cancel/${request.redeem_request_id}`, {
        cancel_reason: reason
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success(t("activity_history.cancel_success"));
      queryClient.invalidateQueries({ queryKey: ["redeem-request-nano", id] });
      queryClient.invalidateQueries({ queryKey: ["user-activity"] });
      queryClient.invalidateQueries({ queryKey: ["points"] });
      setIsCancelModalOpen(false);
    },
    onError: () => {
      toast.error(t("activity_history.cancel_error"));
    }
  });

  if (isLoading) return <WholePageLoader />;
  if (isError || !request) return <GenericError />;

  const isPending = request.status === "pending";
  const isWorking = request.status === "working";
  const isForPickUp = request.status === "for pick up";
  const isCompleted = request.status === "completed";
  const isCancelled = request.status === "cancelled";
  const isRejected = request.status === "rejected";
  const isRefunded = isCancelled || isRejected;

  const handleCopyId = () => {
    navigator.clipboard.writeText(request.redeem_request_id?.toString() || "");
    setCopied(true);
    toast.success("Redemption ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIcon = () => {
    switch (request.status) {
      case 'completed': return <CheckCircle2 className="text-emerald-600" size={24} />;
      case 'rejected':
      case 'cancelled': return <XCircle className="text-rose-600" size={24} />;
      case 'working': return <Loader2 className="text-yellow-600 animate-spin" size={24} />;
      case 'for pick up': return <Package className="text-orange-600 animate-pulse" size={24} />;
      default: return <Clock className="text-blue-600" size={24} />;
    }
  };

  const handleCancel = () => {
    const finalReason = cancelReason === "other" ? otherReason : cancelReason;
    if (!finalReason) {
      toast.error(t("activity_history.please_select_reason"));
      return;
    }
    cancelMutation.mutate(finalReason);
  };

  const cancelReasons = [
    t("activity_history.reason_changed_mind"),
    t("activity_history.reason_wrong_reward"),
    t("activity_history.reason_long_wait"),
  ];

  // Dynamic Ambient Themes based on status
  const themeStyles = {
    completed: {
      bg: "from-emerald-50/40 via-warm-cream/20 to-warm-beige/10",
      border: "border-emerald-100/40",
      badge: "text-emerald-700 bg-emerald-50 border-emerald-200/30",
      accent: "emerald",
      glow: "from-emerald-100/20"
    },
    pending: {
      bg: "from-blue-50/40 via-warm-cream/20 to-warm-beige/10",
      border: "border-blue-100/40",
      badge: "text-blue-700 bg-blue-50 border-blue-200/30",
      accent: "blue",
      glow: "from-blue-100/20"
    },
    working: {
      bg: "from-yellow-50/30 via-warm-cream/20 to-warm-beige/10",
      border: "border-yellow-100/40",
      badge: "text-yellow-700 bg-yellow-50 border-yellow-200/30",
      accent: "yellow",
      glow: "from-yellow-100/20"
    },
    "for pick up": {
      bg: "from-orange-50/40 via-warm-cream/20 to-warm-beige/10",
      border: "border-orange-100/40",
      badge: "text-orange-700 bg-orange-50 border-orange-200/30",
      accent: "orange",
      glow: "from-orange-100/20"
    },
    cancelled: {
      bg: "from-rose-50/40 via-warm-cream/20 to-warm-beige/10",
      border: "border-rose-100/40",
      badge: "text-rose-700 bg-rose-50 border-rose-200/30",
      accent: "rose",
      glow: "from-rose-100/20"
    },
    rejected: {
      bg: "from-rose-50/40 via-warm-cream/20 to-warm-beige/10",
      border: "border-rose-100/40",
      badge: "text-rose-700 bg-rose-50 border-rose-200/30",
      accent: "rose",
      glow: "from-rose-100/20"
    }
  };

  const currentTheme = themeStyles[request.status as keyof typeof themeStyles] || {
    bg: "from-warm-cream/40 via-warm-cream/20 to-white",
    border: "border-warm-tan/20",
    badge: "text-secondary-dark bg-warm-cream border-warm-tan/30",
    accent: "green",
    glow: "from-green-100/10"
  };

  return (
    <SectionWrapper id="activity-history-redeem" className="px-20 py-10 justify-center items-center max-md:px-10 max-sm:px-6">
      <Helmet>
        <title>{t("activity_history.redemption_details")} | Rise to Rice</title>
      </Helmet>

      {/* Scoped CSS styling for printing clean physical receipts */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background: white !important;
            color: #1e293b !important;
          }
          nav, header, footer, button, a, .no-print {
            display: none !important;
          }
          #activity-history-redeem {
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
            border: 2px dashed #cbd5e1 !important;
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

        <div className={`relative overflow-hidden bg-white rounded-[32px] p-6 md:p-10 border ${currentTheme.border} shadow-[0_15px_50px_rgba(0,0,0,0.025)] print-receipt-card`}>
          {/* Decorative ambient background glows */}
          <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${currentTheme.glow} to-transparent rounded-full blur-3xl pointer-events-none no-print`} />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-warm-cream/30 to-transparent rounded-full blur-3xl pointer-events-none no-print" />

          {/* Header block */}
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-8 border-b border-warm-tan/10">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl bg-warm-cream/50 flex items-center justify-center border border-warm-tan/20 shadow-inner shrink-0 no-print`}>
                {getStatusIcon()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full print-badge">
                    {t("activity_history.reward_redemption")}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-secondary-dark mt-1 tracking-tight">{request.reward_name}</h1>
                <p className="text-muted-foreground/80 flex items-center mt-1 text-sm">
                  <Calendar size={14} className="mr-1.5 text-warm-tan" />
                  {format(new Date(request.timestamp), "MMMM dd, yyyy - hh:mm a")}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1.5 shrink-0 self-stretch md:self-auto border-t md:border-t-0 pt-4 md:pt-0 border-warm-tan/10">
              <div className="flex items-center gap-2">
                <Badge className={`text-xs px-3 py-1 rounded-full font-bold shadow-none border ${currentTheme.badge} print-badge`}>
                  {capitalizeWordStart(t(`redeem_history.status.${request.status?.toLocaleLowerCase()}`))}
                </Badge>
                <span className={`font-extrabold text-lg ${isRefunded ? 'text-muted-foreground/50 line-through' : 'text-red-500 bg-rose-50/50 border border-rose-100/50 px-3 py-0.5 rounded-2xl print-badge'}`}>
                  -{request.points_cost} pts
                </span>
              </div>
              <button 
                onClick={handleCopyId}
                className="group/copy flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-secondary-dark transition-colors cursor-pointer no-print"
                title="Copy Redemption ID"
              >
                <span className="font-mono">ID: #{request.redeem_request_id}</span>
                {copied ? (
                  <Check size={12} className="text-emerald-600 scale-110 transition-transform" />
                ) : (
                  <Copy size={12} className="group-hover/copy:scale-110 transition-transform" />
                )}
              </button>
              <span className="hidden print:inline font-mono text-xs text-muted-foreground">ID: #{request.redeem_request_id}</span>
            </div>
          </div>

          {/* Interactive 3-Card Metrics Deck */}
          <div className="grid grid-cols-3 gap-4 mb-8 no-print">
            {/* Points Cost Card */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between group cursor-default shadow-sm
              ${isRefunded 
                ? 'bg-slate-50/50 border-slate-200/60 hover:bg-slate-50' 
                : 'bg-rose-50/20 border-rose-100/50 hover:bg-rose-50/40 hover:border-rose-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Points Used</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border group-hover:scale-110 transition-transform
                  ${isRefunded 
                    ? 'bg-slate-100 border-slate-200 text-slate-400' 
                    : 'bg-rose-100/50 border-rose-200/50 text-rose-500'}`}>
                  <Coins size={16} />
                </div>
              </div>
              <div>
                <span className={`text-2xl font-extrabold ${isRefunded ? 'text-muted-foreground/60 line-through' : 'text-rose-600'}`}>
                  -{request.points_cost}
                </span>
                <span className="text-xs font-bold text-muted-foreground ml-1">pts</span>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                  {isRefunded ? "100% refunded" : "Deducted from balance"}
                </p>
              </div>
            </div>

            {/* Quantity Card */}
            <div className="bg-warm-cream/40 p-5 rounded-2xl border border-warm-tan/10 hover:border-warm-tan/50 hover:bg-warm-cream/60 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-default">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider">Claim Size</span>
                <div className="w-8 h-8 rounded-lg bg-warm-cream flex items-center justify-center text-warm-tan border border-warm-tan/10 group-hover:scale-110 transition-transform">
                  <ShoppingBag size={16} />
                </div>
              </div>
              <div className="min-w-0">
                <span className="text-xl font-extrabold text-secondary-dark leading-tight block truncate uppercase">
                  {request.quantity} {request.unit || "unit"}
                </span>
                <p className="text-[10px] text-muted-foreground/60 mt-1">Quantity claim size</p>
              </div>
            </div>

            {/* Live Status Card */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between group cursor-default shadow-sm
              ${currentTheme.bg} ${currentTheme.border} hover:shadow-md hover:-translate-y-1`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-secondary-dark uppercase tracking-wider">Tracking</span>
                <div className="w-8 h-8 rounded-full bg-white/80 shadow-sm flex items-center justify-center text-secondary-dark group-hover:scale-110 transition-transform">
                  {getStatusIcon()}
                </div>
              </div>
              <div>
                <span className="text-lg font-extrabold text-secondary-dark block capitalize leading-tight">
                  {t(`redeem_history.status.${request.status?.toLocaleLowerCase()}`)}
                </span>
                <p className="text-[10px] text-muted-foreground/70 mt-1">Live tracking active</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8 items-start">
            {/* Delivery Status Visual Timeline Progress Board */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">{t("activity_history.delivery_status")}</h3>
                
                <div className="relative pl-8 space-y-6 ml-3">
                  {/* Background track line */}
                  <div className="absolute left-[15px] top-[10px] bottom-[10px] w-0.5 bg-warm-tan/15" />

                  {/* Dynamic filled progress track */}
                  <div 
                    className="absolute left-[15px] top-[10px] w-0.5 bg-gradient-to-b from-blue-500 via-orange-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out" 
                    style={{ 
                      height: 
                        isPending ? "15%" :
                        isWorking ? "45%" :
                        isForPickUp ? "75%" :
                        isCompleted ? "100%" : "0%"
                    }} 
                  />

                  {/* Standard Timeline Steps */}
                  {!(isCancelled || isRejected) && (
                    <>
                      {/* Step 1: Pending */}
                      <div className="relative flex items-start gap-4 transition-all duration-300">
                        <div className={`absolute -left-[32px] w-6 h-6 rounded-full border-4 border-white shadow flex items-center justify-center text-[9px] text-white font-bold transition-all duration-300
                          ${isPending || isWorking || isForPickUp || isCompleted 
                            ? 'bg-blue-500 ring-4 ring-blue-500/20' 
                            : 'bg-slate-200 text-slate-400'}`}>
                          {isWorking || isForPickUp || isCompleted ? "✓" : "1"}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-bold transition-colors
                            ${isPending || isWorking || isForPickUp || isCompleted ? 'text-secondary-dark' : 'text-muted-foreground/60'}`}>
                            {t("redeem_history.status.pending")}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Redemption submitted. Waiting for keeper confirmation.</p>
                        </div>
                      </div>
                      
                      {/* Step 2: Working */}
                      <div className="relative flex items-start gap-4 transition-all duration-300">
                        <div className={`absolute -left-[32px] w-6 h-6 rounded-full border-4 border-white shadow flex items-center justify-center text-[9px] text-white font-bold transition-all duration-300
                          ${isWorking || isForPickUp || isCompleted 
                            ? 'bg-yellow-500 ring-4 ring-yellow-500/20' 
                            : 'bg-slate-200 text-slate-400'}
                          ${isWorking ? 'ring-4 ring-yellow-500/40 animate-pulse' : ''}`}>
                          {isWorking && <Loader2 size={10} className="animate-spin text-white" />}
                          {(isForPickUp || isCompleted) && "✓"}
                          {!isWorking && !isForPickUp && !isCompleted && "2"}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-bold transition-colors
                            ${isWorking || isForPickUp || isCompleted ? 'text-secondary-dark' : 'text-muted-foreground/60'}`}>
                            {t("redeem_history.status.working")}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Staff members are actively preparing and packaging rewards.</p>
                        </div>
                      </div>

                      {/* Step 3: For Pick Up */}
                      <div className="relative flex items-start gap-4 transition-all duration-300">
                        <div className={`absolute -left-[32px] w-6 h-6 rounded-full border-4 border-white shadow flex items-center justify-center text-[9px] text-white font-bold transition-all duration-300
                          ${isForPickUp || isCompleted 
                            ? 'bg-orange-500 ring-4 ring-orange-500/20' 
                            : 'bg-slate-200 text-slate-400'}
                          ${isForPickUp ? 'ring-4 ring-orange-500/40 animate-pulse' : ''}`}>
                          {isForPickUp && <Sparkles size={10} className="animate-pulse text-white" />}
                          {isCompleted && "✓"}
                          {!isForPickUp && !isCompleted && "3"}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-bold transition-colors
                            ${isForPickUp || isCompleted ? 'text-secondary-dark' : 'text-muted-foreground/60'}`}>
                            {t("redeem_history.status.for pick up")}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Items are ready! Drop by our collection point to pick up.</p>
                        </div>
                      </div>

                      {/* Step 4: Completed */}
                      <div className="relative flex items-start gap-4 transition-all duration-300">
                        <div className={`absolute -left-[32px] w-6 h-6 rounded-full border-4 border-white shadow flex items-center justify-center text-[9px] text-white font-bold transition-all duration-300
                          ${isCompleted 
                            ? 'bg-emerald-500 ring-4 ring-emerald-500/20' 
                            : 'bg-slate-200 text-slate-400'}
                          ${isCompleted ? 'ring-4 ring-emerald-500/40 animate-pulse' : ''}`}>
                          {isCompleted ? "✓" : "4"}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-bold transition-colors
                            ${isCompleted ? 'text-emerald-700' : 'text-muted-foreground/60'}`}>
                            {t("redeem_history.status.completed")}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Redeemed reward collected. Thank you for recycling!</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Cancelled/Rejected Steps */}
                  {(isCancelled || isRejected) && (
                    <>
                      <div className="relative flex items-start gap-4">
                        <div className="absolute -left-[32px] w-6 h-6 rounded-full border-4 border-white shadow bg-blue-500 flex items-center justify-center text-[9px] text-white font-bold">✓</div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-secondary-dark">{t("redeem_history.status.pending")}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Redemption was initiated successfully.</p>
                        </div>
                      </div>

                      <div className="relative flex items-start gap-4">
                        <div className="absolute -left-[32px] w-6 h-6 rounded-full border-4 border-white shadow bg-rose-500 flex items-center justify-center text-[9px] text-white font-bold">✕</div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-rose-600">{t(`redeem_history.status.${request.status}`)}</p>
                          {request.cancel_reason ? (
                            <div className="mt-2 bg-rose-50/50 p-3 rounded-xl border border-rose-100 text-xs">
                              <span className="font-semibold text-rose-800">Reason: </span>
                              <span className="text-rose-700 font-medium italic">"{request.cancel_reason}"</span>
                            </div>
                          ) : (
                            <p className="text-[11px] text-muted-foreground mt-0.5">Transaction was halted by user or keeper.</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Resident details and Reward Showcase */}
            <div className="space-y-6">
              {/* Resident Profile block */}
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

              {/* Reward Showcase / Polaroid frame */}
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Redeemed Reward</h3>
                {request.image_url ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="group bg-white p-3 rounded-2xl border border-warm-tan/20 shadow-md aspect-video relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer">
                        <div className="w-full h-full rounded-xl overflow-hidden relative">
                          <img 
                            src={request.image_url} 
                            alt={request.reward_name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                          <div className="absolute inset-0 bg-secondary-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white gap-2 font-semibold text-xs rounded-xl no-print">
                            <ZoomIn size={18} />
                            Click to Zoom
                          </div>
                          <div className="absolute top-2 right-2 bg-secondary-dark/70 text-white backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
                            Claim Item
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-md rounded-[24px] border-none shadow-2xl p-4 overflow-hidden">
                      <div className="w-full rounded-2xl overflow-hidden shadow-inner border border-warm-tan/10">
                        <img 
                          src={request.image_url} 
                          alt={request.reward_name} 
                          className="w-full h-auto object-contain max-h-[80vh] mx-auto rounded-xl"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-warm-tan/30 bg-warm-beige/5 p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-warm-cream/50 flex items-center justify-center mb-3 text-secondary-dark">
                      <Package className="text-warm-tan animate-none" size={24} />
                    </div>
                    <p className="text-secondary-dark font-semibold text-sm mb-1">{request.reward_name}</p>
                    <p className="text-[11px] text-muted-foreground/80 max-w-[200px]">
                      Authentic local reward variation claimed. Enjoy your points utilization!
                    </p>
                  </div>
                )}
              </div>

              {/* Refund confirmation banner */}
              {isRefunded && (
                <div className="bg-emerald-50/30 border border-green-200/30 p-4 rounded-2xl flex items-start gap-3 shadow-sm animate-none">
                  <RefreshCw className="text-emerald-600 shrink-0 mt-0.5 animate-spin-slow" size={18} />
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">100% Points Refunded</span>
                    <p className="text-[11px] text-emerald-700/80 leading-normal mt-0.5">
                      Your {request.points_cost} points have been immediately credited back to your account wallet.
                    </p>
                  </div>
                </div>
              )}

              {/* Message from Hub Keeper */}
              {request.admin_notes && (
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Message from Collection Hub</h3>
                  <div className="bg-yellow-50/40 p-4 rounded-2xl border border-yellow-100 flex items-start gap-3 shadow-inner">
                    <MessageSquare className="text-yellow-600 shrink-0 mt-0.5" size={18} />
                    <div>
                      <span className="text-[10px] font-bold text-yellow-800 uppercase tracking-wider block">Keeper Remarks</span>
                      <p className="text-xs text-yellow-900 leading-relaxed font-medium mt-0.5 italic">"{request.admin_notes}"</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action cancel button */}
          {isPending && (
            <div className="pt-6 border-t border-warm-tan/10 flex justify-end no-print">
              <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="rounded-full px-6 text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-md">
                    {t("activity_history.cancel_request")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[24px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-secondary-dark">{t("activity_history.cancel_request_title")}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground leading-normal mt-2">
                      {t("activity_history.cancel_request_desc")}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <Select value={cancelReason} onValueChange={setCancelReason}>
                      <SelectTrigger className="rounded-xl border-warm-tan/30">
                        <SelectValue placeholder={t("activity_history.select_cancel_reason")} />
                      </SelectTrigger>
                      <SelectContent>
                        {cancelReasons.map(r => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                        <SelectItem value="other">{t("activity_history.reason_other")}</SelectItem>
                      </SelectContent>
                    </Select>

                    {cancelReason === "other" && (
                      <Input
                        placeholder={t("activity_history.other_reason_placeholder")}
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        className="rounded-xl border-warm-tan/30"
                      />
                    )}
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setIsCancelModalOpen(false)} className="rounded-full text-xs font-bold uppercase tracking-wider border-warm-tan/30">
                      {t("activity_history.keep_request")}
                    </Button>
                    <Button variant="destructive" onClick={handleCancel} disabled={cancelMutation.isPending} className="rounded-full text-xs font-bold uppercase tracking-wider">
                      {cancelMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t("activity_history.confirm_cancel")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Decorative barcode accent */}
          <div className="mt-8 pt-6 border-t border-dashed border-warm-tan/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/60 no-print">
            <div className="flex items-center gap-2">
              <div className="h-6 w-32 bg-[repeating-linear-gradient(90deg,currentColor,currentColor_2px,transparent_2px,transparent_6px)] opacity-30" title="Decorative Barcode" />
              <span className="font-mono text-[10px]">VERIFIED TRANSACTION</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Official Redemption Receipt</span>
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
          <p className="font-bold text-[9px] uppercase">REWARD REDEMPTION RECEIPT</p>
        </div>

        <div className="space-y-1 mb-4">
          <div className="flex justify-between">
            <span>RECEIPT ID:</span>
            <span className="font-bold">#{request.redeem_request_id}</span>
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
            <span>STATUS:</span>
            <span className="font-bold uppercase">{request.status}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-slate-300 my-2"></div>

        {/* Itemized Table */}
        <div className="space-y-1.5 py-1">
          <div className="flex justify-between font-bold">
            <span>REWARD ITEM</span>
            <span>QTY</span>
          </div>
          <div className="flex justify-between">
            <span className="uppercase">{request.reward_name}</span>
            <span>{request.quantity} {request.unit || "unit"}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-slate-300 my-2"></div>

        {/* Totals & Notes */}
        <div className="space-y-1 py-1">
          <div className="flex justify-between text-xs font-bold">
            <span>POINTS COST:</span>
            <span className={isRefunded ? "line-through text-slate-400" : ""}>
              -{request.points_cost} PTS
            </span>
          </div>
          {isRefunded && (
            <div className="flex justify-between text-[9px] text-emerald-700 font-semibold">
              <span>REFUND STATUS:</span>
              <span>REFUNDED (+{request.points_cost} PTS)</span>
            </div>
          )}
          {request.admin_notes && (
            <div className="mt-2 text-[9px] text-slate-600 bg-slate-50 p-2 rounded border border-dashed border-slate-200">
              <span className="font-bold">HUB REMARKS:</span>
              <p className="italic mt-0.5">"{request.admin_notes}"</p>
            </div>
          )}
        </div>

        <div className="border-t border-dashed border-slate-300 my-3"></div>

        <div className="text-center space-y-1">
          <p className="font-bold text-emerald-600">✓ TRANSACTION VERIFIED</p>
          <p className="text-[8px] text-slate-500">Thank you for redeeming with us!</p>
          <div className="mt-3 flex justify-center opacity-70">
            <div className="h-6 w-28 bg-[repeating-linear-gradient(90deg,currentColor,currentColor_2px,transparent_2px,transparent_4px)]" />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
