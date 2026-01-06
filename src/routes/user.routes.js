import { Router } from "express";
import { deleteUser, getUsers } from "../controllers/user.controllers.js";
import { authorize, restrictTo } from "../middlewares/auth.middleware.js";

const userRoute = Router();

userRoute.get("/", authorize, restrictTo("admin"), getUsers);
userRoute.delete("/:id", authorize, restrictTo("admin"), deleteUser);
// router.put("/:id", updateAccount);

export default userRoute;
