import { Router } from "express";
import { getAccounts } from "../controllers/account.controllers.js";

export const accountRoute = Router();

accountRoute.get("/", getAccounts);
// router.put("/:id", updateAccount);
// router.delete("/:id", deleteAccount);
