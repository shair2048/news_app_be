const bcrypt = require("bcrypt");
const { generateUniqueUsername } = require("../utils/username.js");
const Account = require("../models/account.model.js");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
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

const loginUser = async (req, res) => {
  console.log("Login request received:", req.body);
  const { email, password } = req.body;

  // console.log("Login request received:", email, password);

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const account = await Account.findOne({
      email,
    });
    console.log("Account found:", account);
    const uid = account._id;

    if (!account) {
      return res.status(404).json({ message: "Account not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, account.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign({ id: uid }, "SECRET_KEY", { expiresIn: "1d" });

    res.status(200).json({
      message: "Login successful.",
      token,
      account: { email: account.email, name: account.name },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { registerUser, loginUser };
