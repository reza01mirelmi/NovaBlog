import { Request, Response, NextFunction } from "express";
import validPost from "../validations/post.validation";
import validPostUpdate from "../validations/updatePost.validation";
import {
  createPostService,
  getService,
  getAllPostService,
  getPostMeService,
  getPostAuthorService,
  updatePostService,
  deletePostService,
  updateStatusService,
} from "./../services/post.service";
import { modelPostType } from "../Types/post.type";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const imageURL = req.file
      ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(
          /\\/g,
          "/"
        )}`
      : null;

    const data: modelPostType = {
      ...req.body,
      image: imageURL,
    };
    const validBody = validPost(data);
    if (validBody !== true) {
      return res.status(400).json(validBody);
    }
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const authorId = req.user._id;
    const result = await createPostService(data, authorId);
    return res.status(result.code).json({
      message: result.message,
      post: result.safePost || undefined,
    });
  } catch (err) {
    next(err);
  }
};

const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const authorId = req.user._id;
    const postId = req.params.id;
    const role = req.user.role;

    const result = await getService(postId, authorId, role);

    return res
      .status(result.code)
      .json({ message: result.message, post: result.post || undefined });
  } catch (err) {
    next(err);
  }
};

const getAllPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllPostService();

    return res
      .status(result.code)
      .json({ message: result.message, post: result.post || undefined });
  } catch (err) {
    next(err);
  }
};

const getPostMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const authorId = req.user._id;
    const result = await getPostMeService(authorId);

    return res
      .status(result.code)
      .json({ message: result.message, posts: result.posts || undefined });
  } catch (erorr) {
    next(erorr);
  }
};

const getPostAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getPostAuthorService(
      req.query.page as string | undefined,
      req.query.limit as string | undefined,
      req.query.status as string | undefined,
      req.query.title as string | undefined
    );

    return res
      .status(result.code)
      .json({ message: result.message, posts: result.posts });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.id;
    const authorId = req.user._id;
    const data = req.body;

    const validBody = validPostUpdate(data);
    if (validBody !== true) {
      return res.status(400).json(validBody);
    }

    const imageURL = req.file
      ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(
          /\\/g,
          "/"
        )}`
      : undefined;

    const input = { data, image: imageURL };

    const result = await updatePostService(authorId, postId, input);

    return res.status(result.code).json({
      message: result.message,
      post: result.post || undefined,
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = req.params.id;
    const { status } = req.body;

    const result = await updateStatusService(postId, status);

    return res.status(result.code).json({
      message: result.message,
      post: result.post || undefined,
    });
  } catch (erorr) {
    next(erorr);
  }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.id;
    const authorId = req.user._id;
    const role = req.user.role;

    const result = await deletePostService(postId, authorId, role);

    return res.status(result.code).json({ message: result.message });
  } catch (erorr) {
    next(erorr);
  }
};

export default {
  createPost,
  getPost,
  getAllPost,
  deletePost,
  getPostMe,
  updatePost,
  updateStatus,
  getPostAuthor,
};
