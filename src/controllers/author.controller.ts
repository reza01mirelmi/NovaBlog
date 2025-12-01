import { Request, Response, NextFunction } from "express";
import { AuthorDTO } from "../Types/author.type";
import {
  getAllAuthorsService,
  updateAuthorService,
  removeAuthorService,
  changeRoleAuthorService,
} from "./../services/author.service";

const allAuthor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authors = await getAllAuthorsService();

    if (authors.length === 0) {
      return res
        .status(200)
        .json({ message: "authors not found.❌", authors: [] });
    }
    return res
      .status(200)
      .json({ message: "authors list sent successfully.✅", authors });
  } catch (err) {
    next(err);
  }
};

const removeAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const author = await removeAuthorService(req.params.id);

    if (!author) {
      return res
        .status(404)
        .json({ meseage: "author with this ID was not found.❌" });
    }

    return res
      .status(200)
      .json({ message: "author successfully deleted.✅", author });
  } catch (err) {
    next(err);
  }
};

const changeRoleAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await changeRoleAuthorService(req.params.id);

    return res.status(result.code).json({
      message: result.message || "Operation completed successfully ✅",
      author: result.author || undefined,
    });
  } catch (err) {
    next(err);
  }
};

const updateAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const input: Partial<AuthorDTO> = req.body;
    const authorId = req.user._id;

    const result = await updateAuthorService(authorId, input);

    return res.status(result.code).json({
      message: result.message,
      author: result.author || undefined,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  allAuthor,
  updateAuthor,
  removeAuthor,
  changeRoleAuthor,
};
