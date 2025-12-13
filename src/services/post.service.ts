import { Types } from "mongoose";
import modelPost from "../models/post.model";
import { modelPostType } from "../Types/post.type";

const createPostService = async (input: modelPostType, authorId: string) => {
  console.log(authorId);
  const isPostExists = await modelPost.findOne({
    title: input.title,
    content: input.content,
    authorId,
  });
  if (isPostExists) {
    return {
      ok: false,
      code: 400,
      message: "This post has already been published.❌",
    };
  }
  if (!input.image) delete input.image;
  const post = await modelPost.create({
    title: input.title,
    content: input.content,
    authorId: new Types.ObjectId(authorId),
    image: input.image,
  });

  const { createdAt, updatedAt, __v, ...safePost } = post.toObject();

  return {
    ok: true,
    code: 200,
    message: "The post was successfully published✅",
    safePost,
  };
};

const getService = async (postId: string, authorId: string, role: string) => {
  const idPost = new Types.ObjectId(postId);
  const idAuthor = new Types.ObjectId(authorId);
  let post;

  if (role === "USER") {
    post = await modelPost
      .findOne({ _id: idPost, authorId: idAuthor })
      .select("-__v")
      .lean();
  } else if (role === "ADMIN") {
    post = await modelPost.findOne({ _id: idPost }).select("-__v").lean();
  }

  if (!post) {
    return {
      ok: false,
      code: 404,
      message: "Post not found.❌",
    };
  }

  return {
    ok: true,
    code: 200,
    message: "Post successfully found✅",
    post,
  };
};

const getAllPostService = async () => {
  const post = await modelPost
    .find({ status: "published" })
    .select("-__v")
    .lean();

  if (post.length == 0) {
    return { ok: false, code: 404, message: "There is no post.❌", post: [] };
  }

  return { ok: true, code: 200, message: "Post successfully found✅", post };
};

const getPostMeService = async (authorId: string) => {
  const idAuthor = new Types.ObjectId(authorId);

  const posts = await modelPost
    .find({ authorId: idAuthor })
    .select("-__v")
    .lean();

  if (posts.length == 0) {
    return {
      ok: false,
      code: 404,
      message: "There is no post.❌",
      posts: [],
    };
  }

  return {
    ok: true,
    code: 200,
    message: "Post successfully found✅",
    posts,
  };
};

const getPostAuthorService = async (
  pag?: string,
  lim?: string,
  status?: string,
  title?: string
) => {
  const query: any = {};

  if (status) {
    query.status = status;
  }

  if (title) {
    query.title = { $regex: title, $options: "i" };
  }

  const page = Number(pag) || 1;
  const limit = Number(lim) || 10;
  const skip = (page - 1) * limit;

  const posts = await modelPost
    .find(query)
    .select("-__v")
    .skip(skip)
    .limit(limit)
    .lean();

  if (posts.length == 0) {
    return {
      ok: false,
      code: 404,
      message: "There is no post.❌",
    };
  }

  return {
    ok: true,
    code: 200,
    message: "Post successfully found✅",
    posts,
  };
};

const updatePostService = async (
  postId: string,
  authorId: string,
  role: string,
  data: modelPostType,
  status?: string
) => {
  const idPost = new Types.ObjectId(postId);
  const idAuthor = new Types.ObjectId(authorId);

  const existingPost = await modelPost.findById(idPost).lean();

  if (!existingPost) {
    return { ok: false, code: 404, message: "Post not found.❌" };
  }

  let updates: Partial<modelPostType> = {};

  if (
    typeof data.title === "string" &&
    data.title.trim() !== existingPost.title
  ) {
    updates.title = data.title.trim();
  }
  if (
    typeof data.content === "string" &&
    data.content.trim() !== existingPost.content
  ) {
    updates.content = data.content.trim();
  }
  const allowedStatus = ["draft", "pending", "published", "rejected"] as const;

  if (role === "ADMIN" && status && allowedStatus.includes(status as any)) {
    updates.status = status as (typeof allowedStatus)[number];
  }

  if (Object.keys(updates).length === 0) {
    return { ok: false, code: 409, message: "No changes to update❌" };
  }

  let post;
  if (role === "USER") {
    post = await modelPost.findOneAndUpdate(
      { _id: idPost, authorId: idAuthor },
      { $set: updates },
      { new: true }
    );
  } else if (role === "ADMIN") {
    post = await modelPost.findByIdAndUpdate(
      idPost,
      { $set: updates },
      { new: true }
    );
  }

  if (!post) {
    return { ok: false, code: 404, message: "Update failed.❌" };
  }

  return {
    ok: true,
    code: 200,
    message: "Update completed successfully✅",
    post,
  };
};

const deletePostService = async (
  idPost: string,
  idAuthor: string,
  role: string
) => {
  const postId = new Types.ObjectId(idPost);
  const authorId = new Types.ObjectId(idAuthor);

  let post;

  if (role === "USER") {
    post = await modelPost.findOneAndDelete({ _id: postId, authorId });
  } else if (role === "ADMIN") {
    post = await modelPost.findOneAndDelete({ _id: postId });
  }

  if (!post) {
    return {
      ok: false,
      code: 404,
      message: "Post not found.❌",
    };
  }

  return {
    ok: true,
    code: 204,
    message: "Post deleted successfully✅",
  };
};

export {
  createPostService,
  getService,
  getAllPostService,
  updatePostService,
  deletePostService,
  getPostMeService,
  getPostAuthorService,
};
