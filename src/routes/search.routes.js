import express from "express";
import { searchArticles } from "../controllers/search.controllers.js";

const searchRoute = express.Router();

searchRoute.get("/", searchArticles);

export default searchRoute;
