const bcrypt = require("bcrypt");
const { generateUniqueUsername } = require("../utils/username.js");
const Account = require("../models/account.model.js");

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

module.exports = { registerUser };
