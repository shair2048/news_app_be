const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const port = 3000;
const cors = require("cors");

const authRoute = require("./routes/auth.route");
const accountRoute = require("./routes/account.route");
const newsRoute = require("./routes/news.route");

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const corsOptions = {
  origin: "http://localhost:8081", // Địa chỉ frontend được phép truy cập
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Các phương thức HTTP được cho phép
  allowedHeaders: ["Content-Type", "Authorization"], // Các header được cho phép
  credentials: true,
};

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

// routes
app.use("/api/auth", authRoute);
app.use("/api/accounts", accountRoute);
app.use("/api/news", newsRoute);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to database successfully!");
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
