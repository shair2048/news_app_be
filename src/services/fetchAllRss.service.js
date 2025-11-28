import { RSS_FEEDS } from "../configs/rssFeeds.js";
import Category from "../models/category.model.js";
import { crawlRssAndStore } from "./fetchRss.service.js";

export async function crawlAllRss() {
  const results = [];

  for (const feed of RSS_FEEDS) {
    // console.log(`---- Crawling RSS: ${feed.slug} ----`);

    let category = await Category.findOne({ slug: feed.slug });

    if (!category) {
      category = await Category.create({
        name: feed.name,
        slug: feed.slug,
        source: feed.sourceUrl,
      });
    }

    const response = await crawlRssAndStore({
      rssUrl: feed.sourceUrl,
      categoryId: category._id,
      maxItems: 10,
    });

    results.push({
      categoryId: category._id,
      categorySlug: feed.slug,
      ...response,
    });

    await delay(500);
  }

  return results;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
