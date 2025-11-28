// import { v2 as cloudinary } from "cloudinary";
import Article from "../models/article.model.js";
// import { crawlAllRss } from "../services/fetchAllRss.service.js";
// import { crawlRssAndStore } from "../services/fetchRss.service.js";

export const getAllArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({});

    res.status(200).json({ success: true, data: articles });
  } catch (error) {
    next(error);
  }
};

export const getArticleById = async (req, res, next) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findById(articleId);

    if (!article) {
      return res
        .status(404)
        .json({ message: `Article with ID ${article} not found!` });
    }

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

// export const fetchArticlesData = async (req, res) => {
//   try {
//     const result = await crawlAllRss();
//     res.status(200).json({ message: "Fetched", result });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error", error: err.message });
//   }
// };
