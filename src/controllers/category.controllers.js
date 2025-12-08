import Article from "../models/article.model.js";
import Category from "../models/category.model.js";

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});

    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const getArticlesByCategory = async (req, res, next) => {
  try {
    const categorySlug = req.params.slug;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const category = await Category.findOne({ slug: categorySlug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const totalArticles = await Article.countDocuments({
      category_id: category._id,
    });

    const articles = await Article.find({
      category_id: category._id,
    })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalArticles / limit),
      totalItems: totalArticles,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
};
