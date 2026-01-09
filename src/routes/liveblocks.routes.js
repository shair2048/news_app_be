import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import {
  authenticateLiveblocks,
  resolveUsers,
} from "../controllers/liveblocks.controllers.js";

const liveblocksRoute = Router();

liveblocksRoute.post("/auth", authorize, authenticateLiveblocks);
liveblocksRoute.post("/resolve-users", authorize, resolveUsers);

export default liveblocksRoute;
