import { Schema, model } from "mongoose";
import { modelPostType } from "../Types/post.type";
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
      type: Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ["draft", "pending", "published", "rejected"],
      default: "draft",
    },
  },
  { timestamps: true, collection: "posts" }
);

export default model<modelPostType>("posts", postSchema);
