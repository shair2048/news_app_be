import { PORT } from "./config/env.js";
import connectDatabase from "./src/database/mongodb.js";
import app from "./src/app.js";

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  await connectDatabase();
});
