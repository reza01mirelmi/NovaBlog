import authorModele from "./../models/author.model";
import bcrypt from "bcrypt";
import { AuthorDTO } from "./../Types/author.type";
import { AuthorDocument } from "../models/author.model";

export const getAllAuthorsService = async () => {
  const authors = await authorModele
    .find({})
    .populate("posts", "title status")
    .select("-password -__v")
    .lean();
  return authors;
};

export const removeAuthorService = async (authorId: string) => {
  const author = await authorModele.findByIdAndDelete(authorId).lean();
  return author;
};

export const changeRoleAuthorService = async (authorId: string) => {
  const author = await authorModele.findOne({ _id: authorId }).lean();
  if (!author) {
    return { ok: false, code: 404, message: "Author does not exist❌" };
  }

  if (author.role === "ADMIN") {
    return {
      ok: false,
      code: 409,
      message: "This author is already an admin❌",
    };
  }

  const updatedRole = await authorModele.findByIdAndUpdate(
    authorId,
    {
      role: "ADMIN",
    },
    { new: true }
  );

  if (!updatedRole) {
    return { ok: false, code: 400, message: "Role update failed❌" };
  }

  return { ok: true, code: 200, author: updatedRole };
};

export const updateAuthorService = async (
  authorId: string,
  input: Partial<AuthorDTO>
) => {
  const author: AuthorDocument | null = await authorModele.findById(authorId);
  if (!author) {
    return { ok: false, code: 404, message: "Author not found❌" };
  }

  let isChanged = false;
  const allowedUpdates: (keyof AuthorDTO)[] = [
    "name",
    "email",
    "phone",
    "password",
  ];

  type UpdatableAuthorFields = Pick<
    AuthorDocument,
    "name" | "email" | "phone" | "password"
  >;

  for (let key of allowedUpdates) {
    const field = key as keyof UpdatableAuthorFields;
    if (field !== "password" && input[field] !== undefined) {
      if (input[field] !== author[field]) {
        author[field] = input[field];
        isChanged = true;
      }
    }
  }
  if (input.password) {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    author.password = hashedPassword;
    author.passwordChangedAt = new Date();
    isChanged = true;
  }

  if (!isChanged) {
    return { ok: false, code: 400, message: "No changes detected ❌" };
  }

  await author.save();

  const authorObject = author.toObject();
  Reflect.deleteProperty(authorObject, "password");

  return {
    ok: true,
    code: 200,
    author: authorObject,
    message: "Author updated successfully✅",
  };
};

export default {
  getAllAuthorsService,
  updateAuthorService,
  removeAuthorService,
  changeRoleAuthorService,
};
