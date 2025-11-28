import * as cheerio from "cheerio";
import axios from "axios";
import Article from "../models/article.model.js";

export async function crawlRssAndStore({
  rssUrl = "",
  categoryId = null,
  maxItems = 10,
} = {}) {
  const result = {
    processed: 0,
    created: 0,
    skippedExisting: 0,
    errors: [],
  };

  try {
    const rssRes = await axios.get(rssUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 10000,
    });

    // Parse RSS XML
    const $rss = cheerio.load(rssRes.data, { xmlMode: true });

    const rssItems = $rss("item").toArray().slice(0, maxItems);

    for (const rssItem of rssItems) {
      result.processed++;

      try {
        const $rssItem = $rss(rssItem);

        const title = $rssItem.find("title").text().trim();
        const articleUrl = $rssItem.find("link").text().trim();

        if (!articleUrl) {
          result.errors.push({ error: "RSS item has no link" });
          continue;
        }

        const existed = await Article.findOne({ articleUrl }).lean();
        if (existed) {
          result.skippedExisting++;
          continue;
        }

        let description = null;
        let content = null;
        let imageUrl = null;
        let publishedAt = null;

        try {
          const htmlResponse = await axios.get(articleUrl, {
            headers: { "User-Agent": "Mozilla/5.0" },
            timeout: 15000,
          });

          const $html = cheerio.load(htmlResponse.data);

          description = $html("meta[name=description]").attr("content") || null;

          let extractedText = "";
          $html("article p.Normal").each((index, element) => {
            const paragraphText = $html(element).text().trim();
            if (paragraphText) {
              extractedText += paragraphText + "\n\n";
            }
          });

          content = extractedText.trim() || null;

          imageUrl =
            $html("figure meta[itemprop='url']").attr("content") || null;

          publishedAt =
            $html("meta[itemprop='datePublished']").attr("content") || null;
        } catch (err) {
          result.errors.push({
            url: articleUrl,
            error: "Failed to fetch article page: " + err.message,
          });
        }

        const newArticle = {
          title,
          articleUrl,
          description,
          content,
          imageUrl,
          publishedAt: publishedAt ? new Date(publishedAt) : null,
          source: rssUrl,
          category_id: categoryId,
        };

        try {
          await Article.create(newArticle);
          result.created++;
        } catch (saveErr) {
          if (saveErr.code === 11000) {
            result.skippedExisting++;
          } else {
            result.errors.push({ articleUrl, error: saveErr.message });
          }
        }

        await delay(300);
      } catch (itemErr) {
        result.errors.push({ error: itemErr.message });
      }
    }
  } catch (err) {
    result.errors.push({ rssError: err.message });
  }

  return result;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
