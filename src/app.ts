import express, { Request, Response, NextFunction } from "express";
import authRouter from "./routes/auth.routes";
import authorRouter from "./routes/author.routes";
import postRouter from "./routes/post.routes";
import errorHandlers from "./middlewares/errorHandler.middleware";
import helmet from "helmet";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use(helmet());

app.use("/api/auth", authRouter);
app.use("/api/authors", authorRouter);
app.use("/api/posts", postRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  const err: any = new Error(`Can't find ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

app.use(errorHandlers);

export default app;
