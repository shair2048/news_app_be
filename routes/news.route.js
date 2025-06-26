import express from "express";
import multer from "multer";
import { getNews, createNews } from "../controllers/news.controller.js";

export const newsRoute = express.Router();
const upload = multer({
  dest: "uploads/",
});

newsRoute.post("/", upload.single("imageUrl"), createNews);
newsRoute.get("/", getNews);
