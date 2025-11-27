import { Schema, model } from "mongoose";
import { ModelAuthorsType } from "../Types/author.type";

const authorSchema = new Schema<ModelAuthorsType>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
  },
  { timestamps: true }
);

authorSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "authorId",
});

authorSchema.set("toJSON", { virtuals: true });
authorSchema.set("toObject", { virtuals: true });

export default model<ModelAuthorsType>("Author", authorSchema);
