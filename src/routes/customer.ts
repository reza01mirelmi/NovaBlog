import express, { Application, Request, Response } from "express";
import { createCustomer } from "../controllers/customer";
const app: Application = express();

const router = express.Router();

router.route("/register").get();

module.exports = router;
