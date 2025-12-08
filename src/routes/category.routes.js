import { Router } from "express";
import {
  getAllCategories,
  getArticlesByCategory,
} from "../controllers/category.controllers.js";

const categoryRoute = Router();

categoryRoute.get("/", getAllCategories);
categoryRoute.get("/:slug/articles", getArticlesByCategory);

export default categoryRoute;
