import { v2 as cloudinary } from "cloudinary";
import News from "../models/news.model.js";

export const getAllNews = async (req, res, next) => {
  try {
    const news = await News.find({});
    res.status(200).json(news);
  } catch (error) {
    next(error);
  }
};

export const getNewsById = async (req, res, next) => {
  try {
    const newsId = req.params.id;
    const news = await News.findById(newsId);

    if (!news) {
      return res
        .status(404)
        .json({ message: `News with ID ${newsId} not found!` });
    }

    res.status(200).json(news);
  } catch (error) {
    next(error);
  }
};

export const createNews = async (req, res) => {
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

    const news = new News({
      title,
      content,
      imageUrl,
      tags: tags || [],
      category: category || "",
    });

    await news.save();
    res.status(201).json({
      message: "News created successfully.",
      news,
    });
  } catch {
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};
