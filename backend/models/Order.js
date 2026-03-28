import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    imageUrl: { type: String, default: "" },
    color: { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: false, default: "", lowercase: true, trim: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, required: true },
    customerCity: { type: String, required: true },
    items: { type: [OrderItemSchema], default: [] },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: { type: String, default: "cod" },
    notes: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);