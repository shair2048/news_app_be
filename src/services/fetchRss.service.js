import * as cheerio from "cheerio";
import axios from "axios";
import Article from "../models/article.model.js";
import { createNotificationsForNewArticle } from "./notification.service.js";

function getSelectorsByDomain(url) {
  const domain = new URL(url).hostname;

  if (domain.includes("vnexpress.net")) {
    return {
      contentSelector: "article.fck_detail p.Normal",
      removeText: /-\s*VnExpress$/i,
      imageSelector: "meta[itemprop='contentUrl']",
    };
  }

  if (domain.includes("tuoitre.vn")) {
    return {
      contentSelector: ".detail-content p",
      removeText: /-\s*Báo Tuổi Trẻ$/i,
      imageSelector: "meta[property='og:image']",
    };
  }

  if (domain.includes("vtcnews.vn")) {
    return {
      contentSelector: ".edittor-content p",
      removeText: /-\s*VTC News$/i,
      imageSelector: "meta[property='og:image']",
    };
  }

  // Fallback
  return {
    contentSelector: "article p, .content p, .post-content p",
    removeText: null,
    imageSelector: "meta[property='og:image']",
  };
}

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

    const $rss = cheerio.load(rssRes.data, { xmlMode: true });
    const rssItems = $rss("item").toArray().slice(0, maxItems);

    for (const rssItem of rssItems) {
      result.processed++;

      try {
        const $rssItem = $rss(rssItem);
        const title = $rssItem.find("title").text().trim();
        const articleUrl = $rssItem.find("link").text().trim();

        const pubDateRaw = $rssItem.find("pubDate").text();
        let publishedAt = pubDateRaw ? new Date(pubDateRaw) : null;

        if (!articleUrl) continue;

        const existed = await Article.findOne({ articleUrl }).lean();
        if (existed) {
          result.skippedExisting++;
          continue;
        }

        let description = null;
        let content = null;
        let imageUrl = null;

        try {
          const htmlResponse = await axios.get(articleUrl, {
            headers: { "User-Agent": "Mozilla/5.0" },
            timeout: 15000,
          });

          const $html = cheerio.load(htmlResponse.data);

          const selectors = getSelectorsByDomain(articleUrl);

          let rawDescription =
            $html("meta[name=description]").attr("content") ||
            $html("meta[property='og:description']").attr("content");

          if (rawDescription) {
            description = selectors.removeText
              ? rawDescription.replace(selectors.removeText, "")
              : rawDescription;
          }

          let extractedText = "";
          $html(selectors.contentSelector).each((index, element) => {
            const paragraphText = $html(element).text().trim();
            if (paragraphText) {
              extractedText += paragraphText + "\n\n";
            }
          });
          content = extractedText.trim() || null;

          imageUrl =
            $html(selectors.imageSelector).attr("content") ||
            $html("meta[property='og:image']").attr("content") ||
            null;

          if (!publishedAt) {
            const metaDate =
              $html("meta[itemprop='datePublished']").attr("content") ||
              $html("meta[property='article:published_time']").attr("content");
            if (metaDate) publishedAt = new Date(metaDate);
          }
        } catch (err) {
          console.error(`Lỗi parse HTML ${articleUrl}:`, err.message);
          result.errors.push({
            url: articleUrl,
            error: "HTML Fetch Error: " + err.message,
          });
          continue;
        }

        const newArticle = {
          title,
          articleUrl,
          description,
          content,
          imageUrl,
          publishedAt,
          source: rssUrl,
          category_id: categoryId,
        };

        try {
          const createdArticle = await Article.create(newArticle);
          result.created++;

          await createNotificationsForNewArticle(createdArticle);
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
