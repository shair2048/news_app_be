import { Router } from "express";
import { getUsers } from "../controllers/user.controllers.js";

const userRoute = Router();

userRoute.get("/", getUsers);
// userRoute.get("/:id", authorize, getUser);
// router.put("/:id", updateAccount);
// router.delete("/:id", deleteAccount);

export default userRoute;
