import express from "express";
import "dotenv/config";
import authRoute from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
import articleRoute from "./routes/article.routes.js";
import corsMiddleware from "./middlewares/cors.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(corsMiddleware);
app.use(errorMiddleware);

// routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/articles", articleRoute);

export default app;
