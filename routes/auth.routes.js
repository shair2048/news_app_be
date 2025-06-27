import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controllers.js";

export const authRoute = Router();

authRoute.post("/register", registerUser);
authRoute.post("/login", loginUser);
