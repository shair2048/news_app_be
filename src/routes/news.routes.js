import { Router } from "express";
import multer from "multer";
import {
  getAllNews,
  getNews,
  createNews,
} from "../controllers/news.controllers.js";

const newsRoute = Router();
const upload = multer({
  dest: "uploads/",
});

newsRoute.post("/", upload.single("imageUrl"), createNews);
newsRoute.get("/", getAllNews);
newsRoute.get("/:id", getNews);

export default newsRoute;
