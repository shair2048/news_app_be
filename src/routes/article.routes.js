import { Router } from "express";
import {
  getAllArticles,
  getArticleById,
  fetchArticlesData,
  getLatestArticles,
  summarizeArticle,
} from "../controllers/article.controllers.js";

const articleRoute = Router();

articleRoute.get("/", getAllArticles);
articleRoute.get("/latest", getLatestArticles);
articleRoute.get("/fetch/all", fetchArticlesData);
articleRoute.get("/:id", getArticleById);
articleRoute.post("/:id/summarize", summarizeArticle);

export default articleRoute;
