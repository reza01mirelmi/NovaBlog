import express from "express";
import postControllers from "./../controllers/post.controller";
import verifytokenMidd from "./../middlewares/verificationToken.middleware";
import validObjectId from "./../middlewares/validateObjectId.middleware";
import checkAdmin from "../middlewares/checkAdmin.middleware";
import uploader from "../middlewares/upload.middleware";

const post = express.Router();

post
  .route("/")
  .post(verifytokenMidd, uploader.single("image"), postControllers.createPost)
  .get(postControllers.getAllPost);

post
  .route("/author")
  .get(verifytokenMidd, checkAdmin, postControllers.getPostAuthor);

post
  .route("/admin/:id")
  .put(
    validObjectId("id"),
    verifytokenMidd,
    checkAdmin,
    postControllers.updateStatus
  );

post.route("/me").get(verifytokenMidd, postControllers.getPostMe);

post
  .route("/:id")
  .put(
    validObjectId("id"),
    verifytokenMidd,
    uploader.single("image"),
    postControllers.updatePost
  )
  .get(validObjectId("id"), verifytokenMidd, postControllers.getPost)
  .delete(validObjectId("id"), verifytokenMidd, postControllers.deletePost);

export default post;
