import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { logger } from "./libs/logger.js";
import { connectDB } from "./db/db.js";
import router from "./routes/index.js";
import dotenv from "dotenv";

dotenv.config(); // ✅ fixed

const app = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  })
);

app.use(cors({
  origin: process.env.CLIENT_URL, // ✅ fixed
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("API is running...");
});

await connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;