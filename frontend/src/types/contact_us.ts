import { PaginationResult } from "./pagination";

export type ContactUs = {
  contact_id: number;
  status: "pending" | "responded" | "resolved";
  submittedAt: Date;
  updatedAt: Date;
  first_name: string;
  last_name: string;
  email: string;
  message: string;
};

export type ContactUsResponse = PaginationResult & {
  result: ContactUs[];
};
