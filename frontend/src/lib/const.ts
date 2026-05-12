import { Reaction } from "@/types/reactions";

export const allowedUploadTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

export const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
  "hsl(var(--chart-9))",
  "hsl(var(--chart-10))",
];

export const roles = [
  {
    value: "admin",
    label: "Admin",
    id: 2,
  },
  {
    value: "user",
    label: "User",
    id: 3,
  },
  {
    value: "super_admin",
    label: "Super Admin",
    id: 1,
  },
];

export const reward_units = ["kg", "lb", "g", "pc"];
export const material_units = ["kg", "lb", "g"];

export const reactions: Reaction[] = [
  "Like",
  "Heart",
  "Haha",
  "Wow",
  "Sad",
  "Angry",
];
