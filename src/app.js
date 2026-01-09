import express from "express";
import authRoute from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
import articleRoute from "./routes/article.routes.js";
import corsMiddleware from "./middlewares/cors.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import categoryRoute from "./routes/category.routes.js";
import searchRoute from "./routes/search.routes.js";
import cookieParser from "cookie-parser";
import notificationRoute from "./routes/notification.routes.js";
import liveblocksRoute from "./routes/liveblocks.routes.js";

const app = express();

// middleware
app.use(corsMiddleware);
app.use(cookieParser());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

// routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/articles", articleRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/search", searchRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/liveblocks", liveblocksRoute);

app.use(errorMiddleware);

export default app;
