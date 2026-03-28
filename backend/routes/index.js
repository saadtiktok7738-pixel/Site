import { Router } from "express";
import healthRouter from "./health.js";
import productsRouter from "./products.js";
import bannersRouter from "./banners.js";
import ordersRouter from "./orders.js";
import authRouter from "./auth.js";
import categoriesRouter from "./categories.js";
import usersRouter from "./users.js";

const router = Router();

router.use(healthRouter);
router.use("/products", productsRouter);
router.use("/banners", bannersRouter);
router.use("/orders", ordersRouter);
router.use("/auth", authRouter);
router.use("/categories", categoriesRouter);
router.use("/users", usersRouter);

export default router;