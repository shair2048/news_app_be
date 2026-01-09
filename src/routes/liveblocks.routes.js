import { Router } from "express";
import { optionalAuthorize } from "../middlewares/auth.middleware.js";
import {
  authenticateLiveblocks,
  resolveUsers,
} from "../controllers/liveblocks.controllers.js";

const liveblocksRoute = Router();

liveblocksRoute.post("/auth", optionalAuthorize, authenticateLiveblocks);
liveblocksRoute.post("/resolve-users", resolveUsers);

export default liveblocksRoute;
