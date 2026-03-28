import { Router } from "express";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { UpdateUserRoleBody } from "../src/api.js";

const router = Router();

function mapUser(u) {
  return {
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    isAdmin: u.isAdmin,
    createdAt: u.createdAt.toISOString(),
  };
}

router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users.map(mapUser));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id/role", async (req, res) => {
  try {
    const body = UpdateUserRoleBody.parse(req.body);
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin: body.isAdmin },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(mapUser(user));
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid input" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me/orders", async (req, res) => {
  try {
    const email = req.headers["x-user-email"];
    if (!email) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const orders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 });
    res.json(
      orders.map((o) => ({
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
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;