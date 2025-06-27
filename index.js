import fs from "node:fs";
import process from "node:process";
// import { createRequire } from "node:module";
import express from "express";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import "dotenv/config";
import { authRoute } from "./routes/auth.route.js";
import { accountRoute } from "./routes/account.route.js";
import { newsRoute } from "./routes/news.route.js";
import path from "path";
import { fileURLToPath } from "url";

// __dirname trong ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// tạo đường dẫn uploads/
const uploadDir = path.join(__dirname, "uploads");

const port = 3000;
const app = express();

if (!fs.existsSync(uploadDir))
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });

const corsOptions = {
  origin: "http://localhost:8081", // Địa chỉ frontend được phép truy cập
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Các phương thức HTTP được cho phép
  allowedHeaders: ["Content-Type", "Authorization"], // Các header được cho phép
  credentials: true,
};

// middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cors(corsOptions));
// routes
app.use("/api/auth", authRoute);
app.use("/api/accounts", accountRoute);
app.use("/api/news", newsRoute);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
  });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
