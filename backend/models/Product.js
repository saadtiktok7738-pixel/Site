import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: null },
    discountPrice: { type: Number, default: null },
    imageUrl: { type: String, required: true },
    images: { type: [String], default: [] },
    category: { type: String, required: true },
    section: { type: String, default: "" },
    colors: { type: [String], default: [] },
    stock: { type: Number, default: 0 },
    isHotSelling: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isOfferProduct: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);