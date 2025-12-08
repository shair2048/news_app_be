import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    source: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
