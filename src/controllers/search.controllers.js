import { GoogleGenerativeAI } from "@google/generative-ai";
import Article from "../models/article.model.js";
import multer from "multer";
import { GEMINI_API_KEY } from "../../configs/env.js";

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

// 2. Cấu hình Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

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
    // const searchQuery = { $text: { $search: keyword } };

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

export const searchArticlesByVoice = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No audio file uploaded",
      });
    }

    // Convert audio buffer to base64
    const audioBase64 = req.file.buffer.toString("base64");

    const prompt = `
      Bạn là một trợ lý tìm kiếm bài viết thông minh.
      Hãy nghe đoạn âm thanh này và trích xuất thông tin dưới dạng JSON.
      
      Yêu cầu:
      1. "keywords": Trích xuất các từ khóa quan trọng nhất để tìm kiếm trong cơ sở dữ liệu (tiếng Việt hoặc tiếng Anh tùy nội dung nói). Loại bỏ các từ thừa như "tìm cho tôi", "bài viết về", "là gì".
      2. "category_intent": Nếu người dùng nhắc đến một thể loại cụ thể (ví dụ: "công nghệ", "sức khỏe", "thể thao"), hãy ghi lại. Nếu không, để null.
      
      Output CHỈ LÀ JSON thuần túy, không có markdown formatting:
      {
        "keywords": "từ khóa 1 từ khóa 2", 
        "category_intent": "tên thể loại hoặc null"
      }
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: audioBase64,
        },
      },
    ]);

    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const searchParams = JSON.parse(cleanJson);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let dbQuery = {};

    if (searchParams.keywords) {
      dbQuery = { $text: { $search: searchParams.keywords } };
    }

    const total = await Article.countDocuments(dbQuery);

    const articles = await Article.find(dbQuery, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" }, publishedAt: -1 })
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
        // score: obj.score,
      };
    });

    res.status(200).json({
      success: true,
      voice_interpreted: {
        raw_keywords: searchParams.keywords,
        intent: searchParams.category_intent,
      },
      keyword: searchParams.category_intent,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data: dataArticles,
    });
  } catch (error) {
    console.error("Voice search error:", error);
    next(error);
  }
};
