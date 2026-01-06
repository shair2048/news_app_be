import { Router } from "express";
import {
  getAllCategories,
  getArticlesByCategory,
  getArticlesPreviewAndCateory,
  toggleFollowCategory,
  checkFollowStatus,
} from "../controllers/category.controllers.js";
import { authorize } from "../middlewares/auth.middleware.js";

const categoryRoute = Router();

categoryRoute.get("/", getAllCategories);
categoryRoute.get("/articles/preview", getArticlesPreviewAndCateory);
categoryRoute.post("/follow", authorize, toggleFollowCategory);
categoryRoute.get("/follow/status/:id", authorize, checkFollowStatus);
categoryRoute.get("/:slug/articles", getArticlesByCategory);

export default categoryRoute;
