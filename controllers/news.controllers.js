import { v2 as cloudinary } from "cloudinary";
import News from "../models/news.model.js";

export const getNews = async (req, res) => {
  try {
    const news = await News.find({});
    res.status(200).json(news);
  } catch {
    res.status(500).json({
      message: "Internal server error.",
    });
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
