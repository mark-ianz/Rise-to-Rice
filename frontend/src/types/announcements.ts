import { PaginationResult } from "./pagination";

export type AnnouncementQueryResponse = PaginationResult & {
  result: Announcement[];
};

export type AnnouncementPagination = {
  pageParams: number[];
  pages: PaginationResult & { result: Announcement[] }[];
};

export type Announcement = {
  title: string;
  description?: string;
  createdAt: string;
  announcement_id: number;
  author_id: number | null;
  image_id?: string;
  image_url?: string;
  total_reactions: number;
};
