import { Router } from "express";
import {
  getAllArticles,
  getArticleById,
  toggleBookmark,
  fetchArticlesData,
  getBookmarkedArticles,
  getLatestArticles,
  summarizeArticle,
  checkBookmarkStatus,
  getCrawledArticlesNumber,
  getSummarizedArticlesNumber,
  getArticlesBySourceStats,
} from "../controllers/article.controllers.js";
import { authorize, restrictTo } from "../middlewares/auth.middleware.js";

const articleRoute = Router();

articleRoute.get("/", getAllArticles);
articleRoute.get("/latest", getLatestArticles);
articleRoute.get("/bookmarked", authorize, getBookmarkedArticles);
articleRoute.get("/fetch/all", fetchArticlesData);
articleRoute.post("/bookmark", authorize, toggleBookmark);
articleRoute.get(
  "/stats/crawled-articles",
  authorize,
  restrictTo("admin"),
  getCrawledArticlesNumber
);
articleRoute.get(
  "/stats/summarized-articles",
  authorize,
  restrictTo("admin"),
  getSummarizedArticlesNumber
);
articleRoute.get(
  "/stats/sources",
  authorize,
  restrictTo("admin"),
  getArticlesBySourceStats
);
articleRoute.get("/bookmark/status/:id", authorize, checkBookmarkStatus);
articleRoute.get("/:id", getArticleById);
articleRoute.post("/:id/summarize", summarizeArticle);

export default articleRoute;
