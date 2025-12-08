import { Router } from "express";
import { getAllCategories } from "../controllers/category.controllers.js";

const categoryRoute = Router();

categoryRoute.get("/", getAllCategories);
// articleRoute.get("/:id", getArticleById);

export default categoryRoute;
