import { Router } from "express";
import { signUp, signIn } from "../controllers/auth.controllers.js";

const authRoute = Router();

authRoute.post("/sign-up", signUp);
authRoute.post("/sign-in", signIn);

export default authRoute;
