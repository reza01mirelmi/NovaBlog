import authorModele from "./../models/author.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RegisterDTO, LoginDTO } from "../Types/auth.type";
import { AuthorDocument } from "../models/author.model";

export const registerUserService = async (input: RegisterDTO) => {
  const isAuthorExists: AuthorDocument | null = await authorModele.findOne({
    $or: [{ email: input.email }, { phone: input.phone }],
  });
  if (isAuthorExists) return null;

  const countUsers = await authorModele.countDocuments();
  const hashPassword = await bcrypt.hash(input.password, 10);

  const user = await authorModele.create({
    name: input.name,
    email: input.email,
    phone: input.phone,
    password: hashPassword,
    role: countUsers > 0 ? "USER" : "ADMIN",
  });
  const userObject = user.toObject();
  Reflect.deleteProperty(userObject, "password");

  const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_JWT!, {
    expiresIn: "30d",
  });
  return { user: userObject, accessToken };
};

export const loginUserService = async (input: LoginDTO) => {
  const user: AuthorDocument | null = await authorModele.findOne({
    $or: [{ email: input.identifier }, { phone: input.identifier }],
  });
  if (!user) return null;

  const checkPassword = await bcrypt.compare(input.password, user.password);
  if (!checkPassword) return false;

  const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_JWT!, {
    expiresIn: "30d",
  });
  const { password, phone, createdAt, updatedAt, id, __v, ...safeUser } =
    user.toObject();

  return { user: safeUser, accessToken };
};

export const getMeUserService = async (userId: string) => {
  const user = await authorModele
    .findById(userId)
    .select("-password -__v")
    .lean();

  return user;
};

export default { registerUserService, loginUserService, getMeUserService };
