import { Router } from "express";
import {
  getAllArticles,
  getArticleById,
  toggleBookmark,
  fetchArticlesData,
  getBookmarkedArticles,
  getLatestArticles,
  summarizeArticle,
} from "../controllers/article.controllers.js";
import authorize from "../middlewares/auth.middleware.js";

const articleRoute = Router();

articleRoute.get("/", getAllArticles);
articleRoute.get("/latest", getLatestArticles);
articleRoute.get("/bookmarked", authorize, getBookmarkedArticles);
articleRoute.get("/fetch/all", fetchArticlesData);
articleRoute.post("/bookmark/:id", authorize, toggleBookmark);
articleRoute.get("/:id", getArticleById);
articleRoute.post("/:id/summarize", summarizeArticle);

export default articleRoute;
