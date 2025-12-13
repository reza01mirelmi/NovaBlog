import mongoose, { Schema, Types, model } from "mongoose";
import { modelPostType } from "../Types/post.type";

export type PostDocument = modelPostType & Document & { _id: Types.ObjectId };

const postSchema = new Schema<modelPostType>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    authorId: {
      type: Types.ObjectId,
      ref: "Author",
    },
    image: {
      type: String,
      empty: false,
    },
    status: {
      type: String,
      enum: ["draft", "pending", "published", "rejected"],
      default: "draft",
    },
  },
  { timestamps: true, collection: "posts" }
);
postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });
export default model<modelPostType>("posts", postSchema);
