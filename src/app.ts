import express, { Request, Response, NextFunction } from "express";
import authRouter from "./routes/auth.routes";
import authorRouter from "./routes/author.routes";
import postRouter from "./routes/post.routes";
import errorHandlers from "./middlewares/errorHandler.middleware";

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/authors", authorRouter);
app.use("/api/posts", postRouter);

app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({ message: "hello" });
});
app.use((req: Request, res: Response, next: NextFunction) => {
  const err: any = new Error(`Can't find ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

app.use(errorHandlers);

export default app;
