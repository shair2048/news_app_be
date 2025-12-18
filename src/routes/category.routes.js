import { Router } from "express";
import {
  getAllCategories,
  getArticlesByCategory,
  getArticlesPreviewAndCateory,
} from "../controllers/category.controllers.js";

const categoryRoute = Router();

categoryRoute.get("/", getAllCategories);
categoryRoute.get("/articles/preview", getArticlesPreviewAndCateory);
categoryRoute.get("/:slug/articles", getArticlesByCategory);

export default categoryRoute;
