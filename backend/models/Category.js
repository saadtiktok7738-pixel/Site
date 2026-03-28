import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);