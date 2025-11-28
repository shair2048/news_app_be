import cron from "node-cron";
import { crawlAllRss } from "../services/fetchAllRss.service.js";

export function startRssCronJob() {
  console.log("RSS CronJob started...");

  // Run every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    console.log("Running RSS crawling job at:", new Date());

    try {
      const result = await crawlAllRss();
      console.log("Crawled RSS:", result);
    } catch (err) {
      console.error("Cron RSS error:", err.message);
    }
  });
}
