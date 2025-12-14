import { Types } from "mongoose";

export interface modelPostType {
  title: string;
  content: string;
  authorId: Types.ObjectId;
  image?: string | null;
  imageHash: string | null;
  status?: "draft" | "pending" | "published" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}

export type UpdatableFields = {
  title?: string;
  content?: string;
  image?: string;
};

export type UpdatableStatus = {
  status: "draft" | "pending" | "published" | "rejected";
};
