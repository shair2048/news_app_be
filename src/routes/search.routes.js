import express from "express";
import {
  searchArticles,
  searchArticlesByVoice,
  upload,
} from "../controllers/search.controllers.js";

const searchRoute = express.Router();

searchRoute.get("/", searchArticles);
searchRoute.post("/voice", upload.single("audio"), searchArticlesByVoice);

export default searchRoute;
