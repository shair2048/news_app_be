import Article from "../models/article.model.js";
import { crawlAllRss } from "../services/fetchAllRss.service.js";

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
      return res.status(404).json({ message: `Article with ID ${article} not found!` });
    }

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

export const fetchArticlesData = async (req, res) => {
  try {
    const result = await crawlAllRss();
    res.status(200).json({ message: "Fetched", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error", error: err.message });
  }
};

export const getLatestArticles = async (req, res) => {
  try {
    const days = Number(req.query.days) || 3;
    const limit = Number(req.query.limit) || 8;
    const hasImage = req.query.hasImage === "true";

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const filter = {
      publishedAt: { $gte: fromDate },
    };

    if (hasImage) {
      filter.imageUrl = { $exists: true, $nin: ["", null] };
    }

    const articles = await Article.find(filter)
      .sort({ publishedAt: -1 })
      .limit(limit)
      .populate({
        path: "category_id",
        select: "name slug",
      });

    const dataArticles = articles.map((article) => {
      const obj = article.toObject();
      return {
        ...obj,
        category: obj.category_id
          ? {
              _id: obj.category_id._id,
              name: obj.category_id.name,
              slug: obj.category_id.slug,
            }
          : null,
        category_id: undefined,
      };
    });

    res.status(200).json({
      success: true,
      daysCount: days,
      limitItems: limit,
      totalItems: articles.length,
      data: dataArticles,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
