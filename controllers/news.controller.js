const News = require("../models/news.model");

const getNews = async (req, res) => {
  try {
    const news = await News.find({});
    res.status(200).json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const createNews = async (req, res) => {
  const { title, content, imageUrl, tags, category } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  try {
    const news = new News({
      title,
      content,
      imageUrl,
      tags: tags || [],
      category: category || "",
    });

    await news.save();
    res.status(201).json({ message: "News created successfully.", news });
  } catch (error) {
    console.error("Error creating news:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { getNews, createNews };
