import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "backend/db/config.env" });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI must be set. Please configure your MongoDB Atlas connection string.");
}

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(MONGO_URI);
  isConnected = true;
  console.log("Connected to MongoDB Atlas");
}

export * from "../models/Index.js";