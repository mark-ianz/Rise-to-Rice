import { z } from "zod";

export const TimeSchema = z.object({
  time: z.enum(
    [
      "today",
      "week",
      "month",
      "3_months",
      "6_months",
      "9_months",
      "this_year",
      "year",
      "year_and_half",
      "2_years",
      "all_time",
    ],
    { message: "Invalid time format" }
  ),
  id: z.string().optional(),
});

export type Time = z.infer<typeof TimeSchema>;
