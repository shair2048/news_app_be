const bcrypt = require("bcrypt");
const Account = require("../models/account.model");
const { generateUniqueUsername } = require("../utils/username");

const createAccount = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required." });
  }

  try {
    const username = await generateUniqueUsername(name);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const account = new Account({
      name,
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await account.save();
    res.status(201).json({ message: "Account created successfully." });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({});
    res.status(200).json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { createAccount, getAccounts };
