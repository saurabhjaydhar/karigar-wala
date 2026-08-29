import mongoose from "mongoose";
import { logger } from "./logger";

export async function connectDb() {
  const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017/karigar_wala";
  await mongoose.connect(uri);
  logger.info("Connected to MongoDB");
}
