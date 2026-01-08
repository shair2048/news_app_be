import Article from "../models/article.model.js";
import Category from "../models/category.model.js";
import User from "../models/user.model.js";

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

    const category = await Category.findOne({ slug: categorySlug }).select("name");

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const categoryName = category.name;

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
      categoryName: categoryName,
      categoryId: category._id,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
};

export const getArticlesPreviewAndCateory = async (req, res, next) => {
  try {
    const result = await Category.aggregate([
      {
        $lookup: {
          from: "articles",
          localField: "_id",
          foreignField: "category_id",
          as: "articles",
          pipeline: [
            {
              $match: {
                imageUrl: { $exists: true, $nin: ["", null] },
              },
            },
            { $sort: { publishedAt: -1 } },
            { $limit: 4 },
            {
              $project: {
                title: 1,
                description: 1,
                imageUrl: 1,
                publishedAt: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          categoryName: "$name",
          categorySlug: "$slug",
          articles: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFollowCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    const isFollowing = user.followedCategories.includes(categoryId);

    if (isFollowing) {
      user.followedCategories.pull(categoryId);
    } else {
      user.followedCategories.push(categoryId);
    }

    await user.save();
    res.status(200).json({ success: true, isFollowing: !isFollowing });
  } catch (error) {
    next(error);
  }
};

export const checkFollowStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categoryId = id;
    const userId = req.user.id;

    const user = await User.findById(userId).select("followedCategories");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isFollowed = user.followedCategories.includes(categoryId);
    res.status(200).json({
      success: true,
      isFollowed: isFollowed,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoriesStats = async (req, res, next) => {
  try {
    const totalArticles = await Article.countDocuments();

    if (totalArticles === 0) {
      return res.json({
        success: true,
        data: [],
        total: 0,
      });
    }

    const stats = await Article.aggregate([
      {
        $group: {
          _id: "$category_id",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: {
          path: "$categoryInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          categoryName: { $ifNull: ["$categoryInfo.name", "Uncategorized"] },
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    const result = stats.map((item) => ({
      categoryName: item.categoryName,
      value: item.count,
      percentage: ((item.count / totalArticles) * 100).toFixed(2),
    }));

    res.json({
      success: true,
      total: totalArticles,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
