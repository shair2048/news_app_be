import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";

export const authRoute = express.Router();

authRoute.post("/register", registerUser);
authRoute.post("/login", loginUser);
