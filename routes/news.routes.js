import { Router } from "express";
import multer from "multer";
import { getNews, createNews } from "../controllers/news.controllers.js";

export const newsRoute = Router();
const upload = multer({
  dest: "uploads/",
});

newsRoute.post("/", upload.single("imageUrl"), createNews);
newsRoute.get("/", getNews);
