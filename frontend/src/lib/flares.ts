import {
  CalendarDays,
  Wrench,
  ClipboardList,
  Recycle,
  Gift,
  Wheat,
  Handshake,
  Leaf,
  Megaphone,
  AlertTriangle,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

export const FLARE_OPTIONS = [
  "General",
  "Urgent",
  "Rewards",
  "Redemption",
  "Sustainability",
  "Scheduling",
  "Materials",
  "Partners",
  "Maintenance",
  "Policy",
] as const;

export type FlareType = (typeof FLARE_OPTIONS)[number];

type FlareConfig = {
  icon: LucideIcon;
  label: { en: string; tl: string };
  group: "operational" | "program" | "community";
  default?: boolean;
  /** active filter/form button */
  active: string;
  /** inactive filter button (borderless pill) */
  filterInactive: string;
  /** inactive form button (bordered pill) */
  formInactive: string;
  /** badge on announcement card header */
  badge: string;
};

export const FLARES: Record<FlareType, FlareConfig> = {
  Scheduling: {
    icon: CalendarDays,
    label: { en: "Scheduling", tl: "Pag-iskedyul" },
    group: "operational",
    active: "bg-orange-600 text-white shadow-sm",
    filterInactive: "text-orange-700 hover:bg-orange-50",
    formInactive: "bg-orange-50/50 text-orange-700 border-orange-100 hover:bg-orange-100/50",
    badge: "bg-orange-50 text-orange-700 border-orange-100/80",
  },
  Maintenance: {
    icon: Wrench,
    label: { en: "Maintenance", tl: "Pagpapanatili" },
    group: "operational",
    active: "bg-slate-600 text-white shadow-sm",
    filterInactive: "text-slate-700 hover:bg-slate-50",
    formInactive: "bg-slate-50/50 text-slate-700 border-slate-100 hover:bg-slate-100/50",
    badge: "bg-slate-50 text-slate-700 border-slate-100/80",
  },
  Policy: {
    icon: ClipboardList,
    label: { en: "Policy", tl: "Patakaran" },
    group: "operational",
    active: "bg-cyan-600 text-white shadow-sm",
    filterInactive: "text-cyan-700 hover:bg-cyan-50",
    formInactive: "bg-cyan-50/50 text-cyan-700 border-cyan-100 hover:bg-cyan-100/50",
    badge: "bg-cyan-50 text-cyan-700 border-cyan-100/80",
  },
  Materials: {
    icon: Recycle,
    label: { en: "Materials", tl: "Mga Materyal" },
    group: "program",
    active: "bg-rose-600 text-white shadow-sm",
    filterInactive: "text-rose-700 hover:bg-rose-50",
    formInactive: "bg-rose-50/50 text-rose-700 border-rose-100 hover:bg-rose-100/50",
    badge: "bg-rose-50 text-rose-700 border-rose-100/80",
  },
  Rewards: {
    icon: Gift,
    label: { en: "Rewards", tl: "Mga Gantimpala" },
    group: "program",
    active: "bg-pink-600 text-white shadow-sm",
    filterInactive: "text-pink-700 hover:bg-pink-50",
    formInactive: "bg-pink-50/50 text-pink-700 border-pink-100 hover:bg-pink-100/50",
    badge: "bg-pink-50 text-pink-700 border-pink-100/80",
  },
  Redemption: {
    icon: Wheat,
    label: { en: "Redemption", tl: "Pagtubos" },
    group: "program",
    active: "bg-amber-600 text-white shadow-sm",
    filterInactive: "text-amber-700 hover:bg-amber-50",
    formInactive: "bg-amber-50/50 text-amber-700 border-amber-100 hover:bg-amber-100/50",
    badge: "bg-amber-50 text-amber-700 border-amber-100/80",
  },
  Partners: {
    icon: Handshake,
    label: { en: "Partners", tl: "Mga Kasosyo" },
    group: "program",
    active: "bg-lime-600 text-white shadow-sm",
    filterInactive: "text-lime-700 hover:bg-lime-50",
    formInactive: "bg-lime-50/50 text-lime-700 border-lime-100 hover:bg-lime-100/50",
    badge: "bg-lime-50 text-lime-700 border-lime-100/80",
  },
  Sustainability: {
    icon: Leaf,
    label: { en: "Sustainability", tl: "Sustentabilidad" },
    group: "community",
    active: "bg-emerald-600 text-white shadow-sm",
    filterInactive: "text-emerald-700 hover:bg-emerald-50",
    formInactive: "bg-emerald-50/50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/50",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100/80",
  },
  General: {
    icon: Megaphone,
    label: { en: "General", tl: "Pangkalahatan" },
    group: "community",
    default: true,
    active: "bg-indigo-600 text-white shadow-sm",
    filterInactive: "text-indigo-700 hover:bg-indigo-50",
    formInactive: "bg-indigo-50/50 text-indigo-700 border-indigo-100 hover:bg-indigo-100/50",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-100/80",
  },
  Urgent: {
    icon: AlertTriangle,
    label: { en: "Urgent", tl: "Apurahan" },
    group: "community",
    active: "bg-red-600 text-white shadow-sm",
    filterInactive: "text-red-700 hover:bg-red-50",
    formInactive: "bg-red-50/50 text-red-700 border-red-100 hover:bg-red-100/50",
    badge: "bg-red-50 text-red-700 border-red-100/80",
  },
};

