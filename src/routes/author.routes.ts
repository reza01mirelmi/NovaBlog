import express from "express";
import authorControllers from "./../controllers/author.controller";
import verifytokenMidd from "./../middlewares/verificationToken.middleware";
import checkAdminMidd from "./../middlewares/checkAdmin.middleware";
import validObjectId from "./../middlewares/validateObjectId.middleware";

const author = express.Router();

author
  .route("/")
  .get(verifytokenMidd, checkAdminMidd, authorControllers.allAuthor)
  .put(verifytokenMidd, authorControllers.updateAuthor);

author
  .route("/:id")
  .delete(
    validObjectId("id"),
    verifytokenMidd,
    checkAdminMidd,
    authorControllers.removeAuthor
  );

author
  .route("/role/:id")
  .put(
    validObjectId("id"),
    verifytokenMidd,
    checkAdminMidd,
    authorControllers.changeRoleAuthor
  );

export default author;
