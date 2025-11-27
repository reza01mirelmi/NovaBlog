import { Types } from "mongoose";

export interface modelPostType {
  title: string;
  content: string;
  authorId: Types.ObjectId;
  image?: string;
  status: "draft" | "pending" | "published" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}
