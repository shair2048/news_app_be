import express from "express";
import { getAccounts } from "../controllers/account.controller.js";

export const accountRoute = express.Router();

accountRoute.get("/", getAccounts);
// router.put("/:id", updateAccount);
// router.delete("/:id", deleteAccount);
