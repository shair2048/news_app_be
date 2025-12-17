import { PORT } from "./configs/env.js";
import connectDatabase from "./src/database/mongodb.js";
import app from "./src/app.js";
import { startRssCronJob } from "./src/services/cronRss.service.js";

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  await connectDatabase();
});

startRssCronJob();
