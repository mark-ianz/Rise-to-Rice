import { z } from "zod";

export const AnnouncementCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  flare: z.enum(["Rice Impact", "Water", "Plastic", "Campaign", "Event"], {
    errorMap: () => ({ message: "A valid flare selection is required" }),
  }),
});

export const UpdateAnnouncementSchema = AnnouncementCreateSchema.extend({
  announcement_id: z.string().min(1, "Announcement ID is required"),
});

export type UpdateAnnouncement = z.infer<typeof UpdateAnnouncementSchema>;
export type AnnouncementCreate = z.infer<typeof AnnouncementCreateSchema>;
