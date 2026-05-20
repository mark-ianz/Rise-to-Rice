import { z } from "zod";

export const AnnouncementCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Image size must be less than 5MB",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
          file.type
        ),
      {
        message: "Invalid file type. Only png and jpeg are allowed.",
      }
    )

    .optional(),
  flare: z.enum(["Rice Impact", "Water", "Plastic", "Campaign", "Event"], {
    errorMap: () => ({ message: "A valid flare selection is required" }),
  }),
});

export const UpdateAnnouncementSchema = AnnouncementCreateSchema.omit({
  image: true,
}).extend({
  announcement_id: z.string().min(1, "Announcement ID is required"),
});

export type UpdateAnnouncement = z.infer<typeof UpdateAnnouncementSchema>;
export type AnnouncementCreate = z.infer<typeof AnnouncementCreateSchema>;
