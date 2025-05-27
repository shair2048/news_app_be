const express = require("express");
const router = express.Router();
const {
  getAccounts,
  //   updateAccount,
  //   deleteAccount,
} = require("../controllers/account.controller");

router.get("/", getAccounts);
// router.put("/:id", updateAccount);
// router.delete("/:id", deleteAccount);

module.exports = router;
