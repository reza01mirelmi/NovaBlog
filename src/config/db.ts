import mongoose from 'mongoose'
require("dotenv").config()
const DataBaseUrl = process.env.MONGO_URL;

mongoose
  .connect(DataBaseUrl as string)
  .then(() => console.log("Conected!✅"))
  .catch((err) => console.log("DB Error ❌",err));