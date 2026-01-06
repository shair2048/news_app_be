import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { getNotifications, markAsRead } from "../controllers/notification.controllers.js";

const notificationRoute = Router();

notificationRoute.get("/", authorize, getNotifications);
notificationRoute.patch("/:id/readed", authorize, markAsRead);

export default notificationRoute;
