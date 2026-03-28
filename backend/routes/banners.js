import { Router } from "express";
import { Banner } from "../models/Banner.js";
import { CreateBannerBody, UpdateBannerBody } from "../src/api.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json(
      banners.map((b) => ({
        id: b._id.toString(),
        title: b.title,
        subtitle: b.subtitle ?? null,
        imageUrl: b.imageUrl,
        linkUrl: b.linkUrl ?? null,
        buttonText: b.buttonText ?? null,
        sortOrder: b.sortOrder,
        isActive: b.isActive,
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = CreateBannerBody.parse(req.body);
    const banner = await Banner.create(body);
    res.status(201).json({
      id: banner._id.toString(),
      title: banner.title,
      subtitle: banner.subtitle ?? null,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl ?? null,
      buttonText: banner.buttonText ?? null,
      sortOrder: banner.sortOrder,
      isActive: banner.isActive,
    });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid input" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const body = UpdateBannerBody.parse(req.body);
    const banner = await Banner.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!banner) {
      res.status(404).json({ error: "Banner not found" });
      return;
    }
    res.json({
      id: banner._id.toString(),
      title: banner.title,
      subtitle: banner.subtitle ?? null,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl ?? null,
      buttonText: banner.buttonText ?? null,
      sortOrder: banner.sortOrder,
      isActive: banner.isActive,
    });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid input" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;