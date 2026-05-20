export type Announcement = {
  announcement_id: string;
  title: string;
  description?: string;
  author_id: number | null;
  image_url?: string;
  flare: "Rice Impact" | "Water" | "Plastic" | "Campaign" | "Event" | "Milestone" | "Tips" | "Rewards" | "Urgent" | "Community" | "Schedule" | "Update" | "Partnership";
  createdAt?: string;
}

export type GetAnnouncement ={
  limit: string;
  order?: "asc" | "desc";
  author_id?: number;
  page: string;
  sort: "latest" | "oldest" | "reactions"
}