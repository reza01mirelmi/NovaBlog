import { Types } from "mongoose";
import modelPost from "../models/post.model";
import { modelPostType } from "../Types/post.type";
import { UpdatableFields } from "../Types/post.type";

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
  authorId: string,
  postId: string,
  input: UpdatableFields
) => {
  const post = await modelPost.findById(postId);
  if (!post) {
    return { ok: false, code: 404, message: "Author not found❌" };
  }
  if (post.authorId.toString() !== authorId.toString()) {
    return { ok: false, code: 403, message: "Unauthorized ❌" };
  }
  let isChanged = false;
  const allowedUpdates: (keyof UpdatableFields)[] = [
    "title",
    "content",
    "image",
  ];

  for (let key of allowedUpdates) {
    const value = input[key];

    if (key === "image" && value) {
      if (value === post.image) {
        return { ok: false, code: 409, message: "This image already exists❌" };
      }
      post.image = value;
      isChanged = true;
    } else if (typeof value === "string" && value !== post[key]) {
      post[key] = value;
      isChanged = true;
    }
  }

  if (!isChanged) {
    return {
      ok: false,
      code: 400,
      message: "No changes detected ❌",
    };
  }
  await post.save();

  return {
    ok: true,
    code: 200,
    message: "Update completed successfully✅",
    post,
  };
};

const updateStatusService = async (postId: string, status: string) => {
  status = status.trim().toLowerCase();
  const allowedStatus = ["draft", "pending", "published", "rejected"] as const;

  if (!allowedStatus.includes(status as any)) {
    return { ok: false, code: 400, message: "Invalid status" };
  }
  const post = await modelPost.findOneAndUpdate(
    { _id: postId },
    { $set: { status } },
    { new: true }
  );

  if (!post) {
    return { ok: false, code: 404, message: "Update failed.❌" };
  }
  return {
    ok: true,
    code: 200,
    message: "Update Status successfully✅",
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
  updateStatusService,
  getPostAuthorService,
};
