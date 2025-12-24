import Article from "../models/article.model.js";

export const searchArticles = async (req, res, next) => {
  try {
    const keyword = req.query.q;

    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Missing keyword q",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const searchQuery = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
      ],
    };

    const total = await Article.countDocuments(searchQuery);

    const articles = await Article.find(searchQuery)
      .sort({ publishedAt: -1 })
      .skip(skip)
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
      keyword,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data: dataArticles,
    });
  } catch (error) {
    next(error);
  }
};
