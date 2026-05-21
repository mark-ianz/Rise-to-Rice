export type Announcement = {
  announcement_id: string;
  title: string;
  description?: string;
  author_id: number | null;
  image_url?: string;
  flare:
    | "Scheduling"
    | "Maintenance"
    | "Policy"
    | "Materials"
    | "Rewards"
    | "Redemption"
    | "Partners"
    | "Sustainability"
    | "General"
    | "Urgent";
  createdAt?: string;
}

export type GetAnnouncement ={
  limit: string;
  order?: "asc" | "desc";
  author_id?: number;
  flare?: string;
  page: string;
  sort: "latest" | "oldest" | "reactions"
}
