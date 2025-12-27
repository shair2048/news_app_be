import { RSS_FEEDS } from "../../configs/rssFeeds.js";
import Category from "../models/category.model.js";
import { crawlRssAndStore } from "./fetchRss.service.js";

export async function crawlAllRss() {
  const results = [];

  for (const feed of RSS_FEEDS) {
    let category = await Category.findOne({ slug: feed.slug });

    if (!category) {
      category = await Category.create({
        name: feed.name,
        slug: feed.slug,
        source: feed.sourceUrl,
      });
    } else {
      const isSourceChanged =
        JSON.stringify(category.source) !== JSON.stringify(feed.sourceUrl);

      if (isSourceChanged) {
        category.source = feed.sourceUrl;
        await category.save();
        console.log(`Updated source for category: ${feed.name}`);
      }
    }

    const feedResults = [];

    for (const rssUrl of feed.sourceUrl) {
      console.log(`Crawling RSS: ${rssUrl}`);

      const response = await crawlRssAndStore({
        rssUrl: rssUrl,
        categoryId: category._id,
        maxItems: 5,
      });

      feedResults.push(response);

      await delay(1000);
    }

    results.push({
      categoryId: category._id,
      categorySlug: feed.slug,
      ...feedResults,
    });
  }

  return results;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
