import { Router } from "express";
import { Product } from "../models/Product.js";
import { CreateProductBody, UpdateProductBody, ListProductsQueryParams } from "../src/api.js";

const router = Router();

function mapProduct(p) {
  return {
    id: p._id.toString(),
    name: p.name,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice ?? null,
    discountPrice: p.discountPrice ?? null,
    imageUrl: p.imageUrl,
    images: p.images || [],
    category: p.category,
    section: p.section,
    colors: p.colors || [],
    stock: p.stock,
    isHotSelling: p.isHotSelling,
    isNewArrival: p.isNewArrival,
    isOfferProduct: p.isOfferProduct,
    inStock: p.inStock,
    createdAt: p.createdAt.toISOString(),
  };
}

async function enforceProductRules(body, excludeId) {
  if (body.isOfferProduct) {
    const query = excludeId ? { isOfferProduct: true, _id: { $ne: excludeId } } : { isOfferProduct: true };
    await Product.updateMany(query, { isOfferProduct: false });
  }

  if (body.isHotSelling) {
    const query = excludeId ? { isHotSelling: true, _id: { $ne: excludeId } } : { isHotSelling: true };
    const hotProducts = await Product.find(query).sort({ createdAt: 1 });
    if (hotProducts.length >= 8) {
      const toRemove = hotProducts.slice(0, hotProducts.length - 7);
      await Product.updateMany(
        { _id: { $in: toRemove.map(p => p._id) } },
        { isHotSelling: false }
      );
    }
  }

  if (body.isNewArrival) {
    const query = excludeId ? { isNewArrival: true, _id: { $ne: excludeId } } : { isNewArrival: true };
    const newProducts = await Product.find(query).sort({ createdAt: 1 });
    if (newProducts.length >= 8) {
      const toRemove = newProducts.slice(0, newProducts.length - 7);
      await Product.updateMany(
        { _id: { $in: toRemove.map(p => p._id) } },
        { isNewArrival: false }
      );
    }
  }
}

router.get("/", async (req, res) => {
  try {
    const query = ListProductsQueryParams.safeParse(req.query);
    const filter = {};

    if (query.success) {
      const { category, section, isHotSelling, isNewArrival, isOfferProduct } = query.data;
      if (category) filter.category = category;
      if (section) filter.section = section;
      if (isHotSelling !== undefined) filter.isHotSelling = isHotSelling;
      if (isNewArrival !== undefined) filter.isNewArrival = isNewArrival;
      if (isOfferProduct !== undefined) filter.isOfferProduct = isOfferProduct;
    }

    let products = await Product.find(filter).sort({ createdAt: -1 });

    if (query.success && query.data.search) {
      const s = query.data.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s) ||
          p.category.toLowerCase().includes(s)
      );
    }

    if (query.success && query.data.limit) {
      products = products.slice(0, Number(query.data.limit));
    }

    res.json(products.map(mapProduct));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = CreateProductBody.parse(req.body);

    await enforceProductRules(body);

    const product = await Product.create({
      name: body.name,
      description: body.description,
      price: body.price,
      originalPrice: body.originalPrice ?? null,
      discountPrice: body.discountPrice ?? null,
      imageUrl: body.imageUrl,
      images: body.images || [],
      category: body.category,
      section: body.section,
      colors: body.colors || [],
      stock: body.stock ?? 100,
      isHotSelling: body.isHotSelling ?? false,
      isNewArrival: body.isNewArrival ?? false,
      isOfferProduct: body.isOfferProduct ?? false,
      inStock: body.inStock,
    });
    res.status(201).json(mapProduct(product));
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid input" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(mapProduct(product));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const body = UpdateProductBody.parse(req.body);

    await enforceProductRules(body, req.params.id);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: body.name,
        description: body.description,
        price: body.price,
        originalPrice: body.originalPrice ?? null,
        discountPrice: body.discountPrice ?? null,
        imageUrl: body.imageUrl,
        images: body.images || [],
        category: body.category,
        section: body.section,
        colors: body.colors || [],
        stock: body.stock ?? 100,
        isHotSelling: body.isHotSelling ?? false,
        isNewArrival: body.isNewArrival ?? false,
        isOfferProduct: body.isOfferProduct ?? false,
        inStock: body.inStock,
      },
      { new: true }
    );
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(mapProduct(product));
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid input" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;