import { Router } from "express";
import { Category } from "../models/Category.js";
import { CreateCategoryBody } from "../src/api.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json(
      categories.map((c) => ({
        id: c._id.toString(),
        name: c.name,
        imageUrl: c.imageUrl,
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = CreateCategoryBody.parse(req.body);
    const category = await Category.create(body);
    res.status(201).json({
      id: category._id.toString(),
      name: category.name,
      imageUrl: category.imageUrl,
    });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid input" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;