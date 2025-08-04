import fs from "node:fs";
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import authRoute from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
import newsRoute from "./routes/news.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import {
  PORT,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "./config/env.js";
import connectDatabase from "./database/mongodb.js";
import corsMiddleware from "./middlewares/cors.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

// __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "uploads");

const app = express();

if (!fs.existsSync(uploadDir))
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });

// middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(corsMiddleware);
app.use(errorMiddleware);

// routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/news", newsRoute);

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  await connectDatabase();
});

// Cloudinary configuration (to save images in cloud)
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});
