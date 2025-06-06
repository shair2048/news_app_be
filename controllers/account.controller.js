const Account = require("../models/account.model");

const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({});
    res.status(200).json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { getAccounts };
