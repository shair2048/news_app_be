import { Router } from "express";
import { getAccounts } from "../controllers/account.controllers.js";

const accountRoute = Router();

accountRoute.get("/", getAccounts);
// router.put("/:id", updateAccount);
// router.delete("/:id", deleteAccount);

export default accountRoute;
