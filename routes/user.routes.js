import { Router } from "express";
import { getUsers, getUser } from "../controllers/user.controllers.js";
import authorize from "../middlewares/auth.middleware.js";

const userRoute = Router();

userRoute.get("/", getUsers);
userRoute.get("/:id", authorize, getUser);
// router.put("/:id", updateAccount);
// router.delete("/:id", deleteAccount);

export default userRoute;
