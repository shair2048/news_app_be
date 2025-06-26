import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateUniqueUsername } from "../utils/username.js";
import Account from "../models/account.model.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({
      message: "Name, email and password are required.",
    });

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
    res.status(201).json({
      message: "Account created successfully.",
    });
  } catch {
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // console.log("Login request received:", email, password);
  if (!email || !password)
    return res.status(400).json({
      message: "Email and password are required.",
    });

  try {
    const account = await Account.findOne({
      email,
    });

    const uid = account._id;

    if (!account)
      return res.status(404).json({
        message: "Account not found.",
      });

    const isPasswordValid = await bcrypt.compare(password, account.password);

    if (!isPasswordValid)
      return res.status(401).json({
        message: "Invalid password.",
      });

    const token = jwt.sign({ id: uid }, "SECRET_KEY", {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful.",
      token,
      account: {
        email: account.email,
        name: account.name,
      },
    });
  } catch {
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};
