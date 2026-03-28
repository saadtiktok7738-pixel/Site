import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    imageUrl: { type: String, required: true },
    linkUrl: { type: String, default: "" },
    buttonText: { type: String, default: "Shop Now" },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Banner =
  mongoose.models.Banner || mongoose.model("Banner", BannerSchema);