import mongoose from "mongoose";
import app from "./app";

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL as string;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("DB connection error ❌", err));
