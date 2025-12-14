import { Schema, model, Document, Types } from "mongoose";
import { AuthorDTO } from "../Types/author.type";

export type AuthorDocument = AuthorDTO & Document & { _id: Types.ObjectId };

const authorSchema = new Schema<AuthorDTO>(
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
  { timestamps: true, collection: "authors" }
);

authorSchema.virtual("posts", {
  ref: "posts",
  localField: "_id",
  foreignField: "authorId",
});

authorSchema.set("toJSON", { virtuals: true });
authorSchema.set("toObject", { virtuals: true });

export default model("authors", authorSchema);
