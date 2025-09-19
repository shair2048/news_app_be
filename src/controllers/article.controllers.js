import { v2 as cloudinary } from "cloudinary";
import Article from "../models/article.model.js";

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

export const createArticle = async (req, res) => {
  const { title, content, tags, category } = req.body;

  if (!title || !content)
    return res.status(400).json({
      message: "Title and content are required.",
    });

  try {
    // Assuming you're using multer for file uploads
    const imageFile = req.file;

    let imageUrl = "";

    if (imageFile) {
      const result = await cloudinary.uploader.upload(imageFile.path, {
        folder: "news_images",
      });

      imageUrl = cloudinary.url(result.public_id, {
        secure: true,
        sign_url: false,
        transformation: [
          {
            quality: "auto",
            fetch_format: "auto",
          },
          {
            width: 800,
            height: 600,
            crop: "fill",
            gravity: "auto",
          }, // Adjust the width, height, and crop
        ],
      });
      // Assign the secure URL to imageUrl
    }

    const article = new Article({
      title,
      content,
      imageUrl,
      tags: tags || [],
      category: category || "",
    });

    console.log("Article created:", article);

    await article.save();
    res.status(201).json({
      message: "Article created successfully.",
      article,
    });
  } catch {
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};
