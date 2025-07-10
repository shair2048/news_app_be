import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controllers.js";

const authRoute = Router();

authRoute.post("/register", registerUser);
authRoute.post("/login", loginUser);

export default authRoute;
