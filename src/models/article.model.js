import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    articleUrl: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    content: {
      type: String,
    },
    summary: {
      text: {
        type: String,
        default: null,
      },
      generatedAt: {
        type: Date,
      },
      modelUsed: {
        type: String,
        default: "gemini-pro",
      },
      status: {
        type: String,
        enum: ["pending", "completed", "failed", "none"],
        default: "none",
      },
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    imageUrl: {
      type: String,
    },
    source: {
      type: String,
    },
    publishedAt: {
      type: Date,
    },
    scrapedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

articleSchema.index({ title: "text", description: "text", content: "text" });

const Article = mongoose.model("Article", articleSchema);
export default Article;
