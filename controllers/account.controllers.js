import Account from "../models/user.model.js";

export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({});
    res.status(200).json(accounts);
  } catch {
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};
