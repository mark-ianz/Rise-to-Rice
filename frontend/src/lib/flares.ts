import {
  Leaf,
  Droplet,
  Recycle,
  Megaphone,
  CalendarDays,
  Trophy,
  Lightbulb,
  Gift,
  AlertTriangle,
  Users,
  Clock,
  RefreshCw,
  Handshake,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

export const FLARE_OPTIONS = [
  "Rice Impact",
  "Water",
  "Plastic",
  "Campaign",
  "Event",
  "Milestone",
  "Tips",
  "Rewards",
  "Urgent",
  "Community",
  "Schedule",
  "Update",
  "Partnership",
] as const;

export type FlareType = (typeof FLARE_OPTIONS)[number];

type FlareConfig = {
  icon: LucideIcon;
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
  "Rice Impact": {
    icon: Leaf,
    active: "bg-emerald-600 text-white shadow-sm",
    filterInactive: "text-emerald-700 hover:bg-emerald-50",
    formInactive: "bg-emerald-50/50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/50",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100/80",
  },
  Water: {
    icon: Droplet,
    active: "bg-sky-600 text-white shadow-sm",
    filterInactive: "text-sky-700 hover:bg-sky-50",
    formInactive: "bg-sky-50/50 text-sky-700 border-sky-100 hover:bg-sky-100/50",
    badge: "bg-sky-50 text-sky-700 border-sky-100/80",
  },
  Plastic: {
    icon: Recycle,
    active: "bg-rose-600 text-white shadow-sm",
    filterInactive: "text-rose-700 hover:bg-rose-50",
    formInactive: "bg-rose-50/50 text-rose-700 border-rose-100 hover:bg-rose-100/50",
    badge: "bg-rose-50 text-rose-700 border-rose-100/80",
  },
  Campaign: {
    icon: Megaphone,
    active: "bg-amber-600 text-white shadow-sm",
    filterInactive: "text-amber-700 hover:bg-amber-50",
    formInactive: "bg-amber-50/50 text-amber-700 border-amber-100 hover:bg-amber-100/50",
    badge: "bg-amber-50 text-amber-700 border-amber-100/80",
  },
  Event: {
    icon: CalendarDays,
    active: "bg-violet-600 text-white shadow-sm",
    filterInactive: "text-violet-700 hover:bg-violet-50",
    formInactive: "bg-violet-50/50 text-violet-700 border-violet-100 hover:bg-violet-100/50",
    badge: "bg-violet-50 text-violet-700 border-violet-100/80",
  },
  Milestone: {
    icon: Trophy,
    active: "bg-yellow-500 text-white shadow-sm",
    filterInactive: "text-yellow-700 hover:bg-yellow-50",
    formInactive: "bg-yellow-50/50 text-yellow-700 border-yellow-100 hover:bg-yellow-100/50",
    badge: "bg-yellow-50 text-yellow-700 border-yellow-100/80",
  },
  Tips: {
    icon: Lightbulb,
    active: "bg-teal-600 text-white shadow-sm",
    filterInactive: "text-teal-700 hover:bg-teal-50",
    formInactive: "bg-teal-50/50 text-teal-700 border-teal-100 hover:bg-teal-100/50",
    badge: "bg-teal-50 text-teal-700 border-teal-100/80",
  },
  Rewards: {
    icon: Gift,
    active: "bg-pink-600 text-white shadow-sm",
    filterInactive: "text-pink-700 hover:bg-pink-50",
    formInactive: "bg-pink-50/50 text-pink-700 border-pink-100 hover:bg-pink-100/50",
    badge: "bg-pink-50 text-pink-700 border-pink-100/80",
  },
  Urgent: {
    icon: AlertTriangle,
    active: "bg-red-600 text-white shadow-sm",
    filterInactive: "text-red-700 hover:bg-red-50",
    formInactive: "bg-red-50/50 text-red-700 border-red-100 hover:bg-red-100/50",
    badge: "bg-red-50 text-red-700 border-red-100/80",
  },
  Community: {
    icon: Users,
    active: "bg-indigo-600 text-white shadow-sm",
    filterInactive: "text-indigo-700 hover:bg-indigo-50",
    formInactive: "bg-indigo-50/50 text-indigo-700 border-indigo-100 hover:bg-indigo-100/50",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-100/80",
  },
  Schedule: {
    icon: Clock,
    active: "bg-orange-600 text-white shadow-sm",
    filterInactive: "text-orange-700 hover:bg-orange-50",
    formInactive: "bg-orange-50/50 text-orange-700 border-orange-100 hover:bg-orange-100/50",
    badge: "bg-orange-50 text-orange-700 border-orange-100/80",
  },
  Update: {
    icon: RefreshCw,
    active: "bg-cyan-600 text-white shadow-sm",
    filterInactive: "text-cyan-700 hover:bg-cyan-50",
    formInactive: "bg-cyan-50/50 text-cyan-700 border-cyan-100 hover:bg-cyan-100/50",
    badge: "bg-cyan-50 text-cyan-700 border-cyan-100/80",
  },
  Partnership: {
    icon: Handshake,
    active: "bg-lime-600 text-white shadow-sm",
    filterInactive: "text-lime-700 hover:bg-lime-50",
    formInactive: "bg-lime-50/50 text-lime-700 border-lime-100 hover:bg-lime-100/50",
    badge: "bg-lime-50 text-lime-700 border-lime-100/80",
  },
};
