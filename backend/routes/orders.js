import { Router } from "express";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { CreateOrderBody, UpdateOrderStatusBody } from "../src/api.js";
import { sendOrderEmail } from "../libs/email.js";

const router = Router();

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

async function generateOrderId() {
  let id;
  let exists;
  do {
    id = Array.from({ length: 8 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
    exists = !!(await Order.findOne({ orderId: id }));
  } while (exists);
  return id;
}

function mapOrder(o) {
  return {
    id: o._id.toString(),
    orderId: o.orderId,
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    customerPhone: o.customerPhone,
    customerAddress: o.customerAddress,
    customerCity: o.customerCity,
    items: o.items,
    total: o.total,
    status: o.status,
    paymentMethod: o.paymentMethod,
    notes: o.notes ?? null,
    createdAt: o.createdAt.toISOString(),
  };
}

router.get("/", async (req, res) => {
  try {
    const email = req.query.email;
    const query = email ? { customerEmail: email.toLowerCase().trim() } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders.map(mapOrder));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = CreateOrderBody.parse(req.body);
    const order = await Order.create({
      orderId: await generateOrderId(),
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      customerAddress: body.customerAddress,
      customerCity: body.customerCity,
      items: body.items,
      total: body.total,
      status: "pending",
      paymentMethod: body.paymentMethod,
      notes: body.notes ?? null,
    });

    for (const item of body.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await Product.findByIdAndUpdate(item.productId, {
          stock: newStock,
          inStock: newStock > 0,
        });
      }
    }

    const mapped = mapOrder(order);

    sendOrderEmail({
      orderId: mapped.orderId,
      customerName: mapped.customerName,
      customerEmail: mapped.customerEmail,
      customerPhone: mapped.customerPhone,
      customerAddress: mapped.customerAddress,
      customerCity: mapped.customerCity,
      items: mapped.items.map((i) => ({
        productName: i.productName,
        quantity: i.quantity,
        price: i.price,
      })),
      total: mapped.total,
      paymentMethod: mapped.paymentMethod,
    }).catch(() => {});

    res.status(201).json(mapped);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid input" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(mapOrder(order));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const body = UpdateOrderStatusBody.parse(req.body);
    const order = await Order.findByIdAndUpdate(req.params.id, { status: body.status }, { new: true });
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(mapOrder(order));
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid input" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;