import Article from "../models/article.model.js";
import { crawlAllRss } from "../services/fetchAllRss.service.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../../configs/env.js";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

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

export const summarizeArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Check summary status
    if (article.summary.status === "completed" && article.summary.text) {
      return res.status(200).json({
        message: "Summary already exists (fetched from cache)",
        data: article,
      });
    }

    if (article.summary.status === "pending") {
      const pendingTime = new Date() - new Date(article.summary.generatedAt);
      if (pendingTime < 2 * 60 * 1000) {
        return res.status(200).json({
          message: "Summary is being generated...",
          data: article,
        });
      }
    }

    if (!article.content) {
      return res.status(400).json({ message: "Article content not found" });
    }

    await Article.findByIdAndUpdate(id, {
      $set: {
        "summary.status": "pending",
        "summary.generatedAt": new Date(),
      },
    });

    const prompt = `
      Hãy đóng vai một biên tập viên tin tức chuyên nghiệp. 
      Nhiệm vụ của bạn là tóm tắt nội dung bài báo sau đây bằng tiếng Việt.
      
      Yêu cầu:
      - Tóm tắt ngắn gọn, súc tích (khoảng 3-5 câu).
      - Giữ lại các ý chính quan trọng nhất.
      - Văn phong khách quan.

      Yêu cầu định dạng (BẮT BUỘC):
      - KHÔNG ĐƯỢC bắt đầu bằng các cụm từ như "Tóm tắt:", "Nội dung:", "Kết quả:" hay tiêu đề in đậm.
      - Chỉ trả về nội dung tóm tắt thuần túy.
      - Bắt đầu ngay vào câu đầu tiên của đoạn văn.

      Nội dung bài báo:
      ${article.content}
    `;

    // Call API Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summaryText = response.text();

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      {
        $set: {
          "summary.text": summaryText,
          "summary.generatedAt": new Date(),
          "summary.modelUsed": "gemini-2.0-flash",
          "summary.status": "completed",
        },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Article summarized successfully",
      data: updatedArticle,
    });
  } catch (error) {
    console.error("Summarize article error:", error);

    await Article.findByIdAndUpdate(id, {
      $set: {
        "summary.status": "failed",
      },
    });

    return res.status(500).json({
      message: "Error summarizing article",
      error: error.message,
    });
  }
};
