import { Router } from "express";
import {
  deleteUser,
  getNewUsersTodayNumber,
  getUsers,
} from "../controllers/user.controllers.js";
import { authorize, restrictTo } from "../middlewares/auth.middleware.js";

const userRoute = Router();

userRoute.get("/", authorize, restrictTo("admin"), getUsers);
userRoute.get("/stats/new-users", authorize, restrictTo("admin"), getNewUsersTodayNumber);
userRoute.delete("/:id", authorize, restrictTo("admin"), deleteUser);

export default userRoute;
