import SectionWrapper from "@/components/general/SectionWrapper";
import { useParams, Link } from "react-router-dom";
import { useGetRedeemRequestByNanoId } from "@/hooks/query/useUserActivity";
import GenericError from "@/components/general/GenericError";
import WholePageLoader from "@/components/general/WholePageLoader";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Package, Clock, Calendar, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
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

  const getStatusIcon = () => {
    switch (request.status) {
      case 'completed': return <CheckCircle2 className="text-green-500" size={32} />;
      case 'rejected':
      case 'cancelled': return <XCircle className="text-red-500" size={32} />;
      case 'working': return <Loader2 className="text-yellow-500 animate-spin" size={32} />;
      case 'for pick up': return <Package className="text-orange-500" size={32} />;
      default: return <Clock className="text-blue-500" size={32} />;
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

  return (
    <SectionWrapper id="activity-history-redeem" className="px-20 py-10 justify-center items-center max-md:px-10 max-sm:px-6">
      <Helmet>
        <title>{t("activity_history.redemption_details")} | Rise to Rice</title>
      </Helmet>

      <div className="max-w-screen-md w-full">
        <Link to="/activity-history" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-secondary-dark mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          {t("activity_history.back_to_history")}
        </Link>

        <div className="bg-white rounded-3xl p-8 border border-warm-tan/20 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-8 border-b border-warm-tan/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-warm-beige/30 flex items-center justify-center border border-warm-tan/20">
                {getStatusIcon()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary-dark">{request.reward_name}</h1>
                <p className="text-muted-foreground flex items-center mt-1">
                  <Calendar size={14} className="mr-1.5" />
                  {format(new Date(request.timestamp), "MMMM dd, yyyy - hh:mm a")}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Badge variant={request.status as any} className="text-sm px-3 py-1 rounded-full">
                {capitalizeWordStart(t(`redeem_history.status.${request.status?.toLocaleLowerCase()}`))}
              </Badge>
              <span className="font-bold text-lg text-red-500">-{request.points_cost} pts</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">{t("activity_history.delivery_status")}</h3>
                
                <div className="relative pl-6 space-y-6 border-l-2 border-warm-tan/20 ml-3">
                  <div className="relative">
                    <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white ${isPending || isWorking || isForPickUp || isCompleted || isCancelled || isRejected ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                    <p className={`font-medium ${isPending || isWorking || isForPickUp || isCompleted || isCancelled || isRejected ? 'text-secondary-dark' : 'text-muted-foreground'}`}>{t("redeem_history.status.pending")}</p>
                  </div>
                  
                  {!(isCancelled || isRejected) && (
                    <>
                      <div className="relative">
                        <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white ${isWorking || isForPickUp || isCompleted ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
                        <p className={`font-medium ${isWorking || isForPickUp || isCompleted ? 'text-secondary-dark' : 'text-muted-foreground'}`}>{t("redeem_history.status.working")}</p>
                      </div>
                      <div className="relative">
                        <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white ${isForPickUp || isCompleted ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                        <p className={`font-medium ${isForPickUp || isCompleted ? 'text-secondary-dark' : 'text-muted-foreground'}`}>{t("redeem_history.status.for pick up")}</p>
                      </div>
                      <div className="relative">
                        <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                        <p className={`font-medium ${isCompleted ? 'text-secondary-dark' : 'text-muted-foreground'}`}>{t("redeem_history.status.completed")}</p>
                      </div>
                    </>
                  )}

                  {(isCancelled || isRejected) && (
                    <div className="relative">
                      <div className="absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white bg-red-500"></div>
                      <p className="font-medium text-red-500">{t(`redeem_history.status.${request.status}`)}</p>
                      {request.cancel_reason && (
                        <p className="text-sm text-muted-foreground mt-1 bg-red-50 p-3 rounded-xl border border-red-100">{request.cancel_reason}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t("activity_history.reward_details")}</h3>
                <div className="bg-warm-beige/20 p-4 rounded-2xl border border-warm-tan/10 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("activity_history.reward_id")}</span>
                    <span className="font-medium">#{request.redeem_request_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("activity_history.requested_by")}</span>
                    <span className="font-medium">{request.first_name} {request.last_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("activity_history.contact")}</span>
                    <span className="font-medium">{request.contact_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("activity_history.points_used")}</span>
                    <span className="font-bold text-red-500">{request.points_cost}</span>
                  </div>
                </div>
              </div>

              {request.admin_notes && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t("activity_history.admin_notes")}</h3>
                  <div className="bg-yellow-50/50 p-4 rounded-2xl border border-yellow-100 flex items-start gap-3">
                    <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-yellow-800 leading-relaxed">{request.admin_notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isPending && (
            <div className="pt-8 border-t border-warm-tan/10 flex justify-end">
              <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="rounded-full px-6">
                    {t("activity_history.cancel_request")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("activity_history.cancel_request_title")}</DialogTitle>
                    <DialogDescription>
                      {t("activity_history.cancel_request_desc")}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <Select value={cancelReason} onValueChange={setCancelReason}>
                      <SelectTrigger>
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
                      />
                    )}
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCancelModalOpen(false)}>
                      {t("activity_history.keep_request")}
                    </Button>
                    <Button variant="destructive" onClick={handleCancel} disabled={cancelMutation.isPending}>
                      {cancelMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t("activity_history.confirm_cancel")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
