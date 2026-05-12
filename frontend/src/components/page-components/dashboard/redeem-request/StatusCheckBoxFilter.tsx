import CheckBoxFilter from "@/components/general/CheckBoxFilter";
import { useTranslation } from "react-i18next";

export default function StatusCheckBoxFilter() {
  const { t } = useTranslation("redeem_rewards");

  const filters = [
    { id: "pending", label: t("redeem_history.status.pending") },
    { id: "for pick up", label: t("redeem_history.status.for pick up") },
    { id: "rejected", label: t("redeem_history.status.rejected") },
    { id: "completed", label: t("redeem_history.status.completed") },
    { id: "cancelled", label: t("redeem_history.status.cancelled") },
  ];

  return <CheckBoxFilter filters={filters} name="status" />;
}
