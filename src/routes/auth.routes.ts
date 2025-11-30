import express from "express";
import authControllers from "./../controllers/auth.controller";
import verificationToken from "./../middlewares/verificationToken.middleware";
const router = express.Router();

router.route("/register").post(authControllers.register);

router.route("/login").post(authControllers.login);

router.route("/me").get(verificationToken, authControllers.getMe);

export default router;
