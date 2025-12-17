import { Router } from "express";
import {
  getAllArticles,
  getArticleById,
  fetchArticlesData,
} from "../controllers/article.controllers.js";

const articleRoute = Router();

articleRoute.get("/", getAllArticles);
articleRoute.get("/:id", getArticleById);
articleRoute.get("/fetch/all", fetchArticlesData);

export default articleRoute;
