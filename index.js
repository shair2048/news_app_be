import fs from "node:fs";
import process from "node:process";
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import "dotenv/config";
import { authRoute } from "./routes/auth.routes.js";
import { accountRoute } from "./routes/account.routes.js";
import { newsRoute } from "./routes/news.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import { PORT } from "./config/env.js";
import { connectDatabase } from "./database/mongodb.js";

// __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "uploads");

const app = express();

if (!fs.existsSync(uploadDir))
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });

const corsOptions = {
  origin: "http://localhost:8081", // Allowed origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed request methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed request headers
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

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  await connectDatabase();
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
