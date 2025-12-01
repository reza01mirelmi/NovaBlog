import express from "express";
import authControllers from "./../controllers/auth.controller";
import verificationToken from "./../middlewares/verificationToken.middleware";
const router = express.Router();

router.route("/register").post(authControllers.registerUser);

router.route("/login").post(authControllers.loginUser);

router.route("/me").get(verificationToken, authControllers.getMeUser);

export default router;
