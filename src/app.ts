import express from "express";
import authorRouter from "./routes/author.routes";
import postRouter from "./routes/post.routes";

const app = express();

app.use(express.json());
app.use("/api/authors", authorRouter);
app.use("/api/posts", postRouter);

app.use((req, res, next) => {
  const err: any = new Error(`Can't find ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

export default app;
