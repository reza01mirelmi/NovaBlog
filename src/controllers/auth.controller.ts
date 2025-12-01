import { Request, Response, NextFunction } from "express";
import validAuthor from "./../validations/author.validation";
import validAuthorLogin from "./../validations/login.validation";
import {
  registerUserService,
  loginUserService,
  getMeUserService,
} from "./../services/auth.service";
import { RegisterDTO, LoginDTO } from "../Types/auth.type";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const input: RegisterDTO = req.body;

    const isBodyValidated = validAuthor(input);

    if (isBodyValidated !== true) {
      return res.status(400).json(isBodyValidated);
    }

    const result = await registerUserService(input);

    if (!result) {
      return res
        .status(409)
        .json({ message: "This email or phone is already registered.❌" });
    }

    const { user, accessToken } = result;

    return res.status(201).json({
      message: "User created successfully.✅",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input: LoginDTO = req.body;
    const isBodyValidated = validAuthorLogin(input);

    if (isBodyValidated !== true) {
      return res.status(400).json(isBodyValidated);
    }

    const result = await loginUserService(input);

    if (result === null) {
      return res.status(404).json({ message: "User not found.❌" });
    }
    if (result === false) {
      return res
        .status(401)
        .json({ message: "The password is not correct.❌" });
    }

    const { user, accessToken } = result;

    return res.status(200).json({ user, accessToken });
  } catch (err) {
    next(err);
  }
};

const getMeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getMeUserService(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }
    return res
      .status(200)
      .json({ message: "User fetched successfully ✅", user });
  } catch (err) {
    next(err);
  }
};

export default {
  registerUser,
  loginUser,
  getMeUser,
};
