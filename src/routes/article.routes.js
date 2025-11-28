import { Router } from "express";
import { getAllArticles } from "../controllers/article.controllers.js";

const articleRoute = Router();

articleRoute.get("/", getAllArticles);
// articleRoute.get("/:id", getArticleById);

export default articleRoute;
