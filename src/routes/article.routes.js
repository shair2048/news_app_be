import { Router } from "express";
// import multer from "multer";
import {
  getAllArticles,
  // getArticleById,
  fetchArticlesData,
} from "../controllers/article.controllers.js";

const articleRoute = Router();
// const upload = multer({
//   dest: "uploads/",
// });

// articleRoute.post("/", upload.single("imageUrl"), createArticle);
articleRoute.get("/", getAllArticles);
// articleRoute.get("/:id", getArticleById);
articleRoute.get("/fetch", fetchArticlesData);

export default articleRoute;
