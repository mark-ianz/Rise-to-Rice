import SectionWrapper from "@/components/general/SectionWrapper";
import { useParams, Link } from "react-router-dom";
import { useGetExchangeLogByNanoId } from "@/hooks/query/useUserActivity";
import GenericError from "@/components/general/GenericError";
import WholePageLoader from "@/components/general/WholePageLoader";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Recycle, Calendar, Scale, Coins, User } from "lucide-react";
import { format } from "date-fns";

export default function ActivityHistoryExchange() {
  const { id } = useParams();
  const { t } = useTranslation("redeem_rewards");
  const { data: request, isLoading, isError } = useGetExchangeLogByNanoId(id);

  if (isLoading) return <WholePageLoader />;
  if (isError || !request) return <GenericError />;

  return (
    <SectionWrapper id="activity-history-exchange" className="px-20 py-10 justify-center items-center max-md:px-10 max-sm:px-6">
      <Helmet>
        <title>{t("activity_history.exchange_details")} | Rise to Rice</title>
      </Helmet>

      <div className="max-w-screen-md w-full">
        <Link to="/activity-history" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-secondary-dark mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          {t("activity_history.back_to_history")}
        </Link>

        <div className="bg-white rounded-3xl p-8 border border-warm-tan/20 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-8 border-b border-warm-tan/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center border border-green-100">
                <Recycle className="text-green-600" size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary-dark">{request.material}</h1>
                <p className="text-muted-foreground flex items-center mt-1">
                  <Calendar size={14} className="mr-1.5" />
                  {format(new Date(request.timestamp), "MMMM dd, yyyy - hh:mm a")}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5">
                <Coins size={14} />
                +{request.points_added} pts
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t("activity_history.exchange_summary")}</h3>
                <div className="bg-warm-beige/20 p-5 rounded-2xl border border-warm-tan/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-warm-tan/10 pb-4">
                    <div className="flex items-center text-muted-foreground">
                      <Scale size={18} className="mr-2" />
                      <span>{t("activity_history.weight")}</span>
                    </div>
                    <span className="font-bold text-lg text-secondary-dark">{request.weight} kg</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-warm-tan/10 pb-4">
                    <div className="flex items-center text-muted-foreground">
                      <Coins size={18} className="mr-2" />
                      <span>{t("activity_history.points_added")}</span>
                    </div>
                    <span className="font-bold text-lg text-green-600">+{request.points_added}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-muted-foreground">
                      <User size={18} className="mr-2" />
                      <span>{t("activity_history.logged_by")}</span>
                    </div>
                    <span className="font-medium text-secondary-dark">{request.logged_by_first_name} {request.logged_by_last_name}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t("activity_history.proof_of_exchange")}</h3>
                {request.image_url ? (
                  <div className="rounded-2xl overflow-hidden border border-warm-tan/20 bg-gray-50 aspect-video relative">
                    <img src={request.image_url} alt="Exchange Proof" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-warm-tan/30 bg-warm-beige/10 p-8 flex flex-col items-center justify-center text-center">
                    <Recycle className="text-warm-tan/50 mb-3" size={40} />
                    <p className="text-muted-foreground font-medium">{t("activity_history.no_image_provided")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
