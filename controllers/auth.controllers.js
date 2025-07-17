import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { generateUniqueUsername } from "../utils/username.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import User from "../models/user.model.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  // const { name, email, password } = req.body;

  // if (!name || !email || !password)
  //   return res.status(400).json({
  //     message: "Name, email and password are required.",
  //   });

  // try {
  //   const username = await generateUniqueUsername(name);

  //   const saltRounds = 10;
  //   const hashedPassword = await bcrypt.hash(password, saltRounds);

  //   const account = new Account({
  //     name,
  //     username,
  //     email: email.toLowerCase(),
  //     password: hashedPassword,
  //   });

  //   await account.save();
  //   res.status(201).json({
  //     message: "Account created successfully.",
  //   });
  // } catch {
  //   res.status(500).json({
  //     message: "Internal server error.",
  //   });
  // }

  try {
    const { name, email, password } = req.body;

    // Check if a user already exists
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      const error = new Error("User already exists with this email");
      error.statusCode = 409;
      throw error;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new account
    const newUsers = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      session: true,
      message: "User created successfully.",
      data: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  // const { email, password } = req.body;

  // // console.log("Login request received:", email, password);
  // if (!email || !password)
  //   return res.status(400).json({
  //     message: "Email and password are required.",
  //   });

  // try {
  //   const account = await Account.findOne({
  //     email,
  //   });

  //   const uid = account._id;

  //   if (!account)
  //     return res.status(404).json({
  //       message: "Account not found.",
  //     });

  //   const isPasswordValid = await bcrypt.compare(password, account.password);

  //   if (!isPasswordValid)
  //     return res.status(401).json({
  //       message: "Invalid password.",
  //     });

  //   const token = jwt.sign({ id: uid }, "SECRET_KEY", {
  //     expiresIn: "1d",
  //   });

  //   res.status(200).json({
  //     message: "Login successful.",
  //     token,
  //     account: {
  //       email: account.email,
  //       name: account.name,
  //     },
  //   });
  // } catch {
  //   res.status(500).json({
  //     message: "Internal server error.",
  //   });
  // }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      session: true,
      message: "User logged in successfully.",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
