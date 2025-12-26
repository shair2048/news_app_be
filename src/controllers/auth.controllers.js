import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { generateUniqueUsername } from "../utils/username.js";
import { NODE_ENV, JWT_SECRET, JWT_EXPIRES_IN } from "../../configs/env.js";
import User from "../models/user.model.js";
import Blacklist from "../models/blacklist.model.js";

const sendTokenResponse = (user, statusCode, res, message) => {
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  // set cookie options
  // const cookieOptions = {
  //   expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  //   httpOnly: true,
  //   secure: NODE_ENV === "production",
  //   sameSite: "lax",
  // };

  // - res.cookie: for Web to store the token in cookies
  // - json({ token }): for Mobile App to store the token in local storage
  res.status(statusCode).json({
    session: true,
    message: message,
    data: {
      token,
      user,
    },
  });
};

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

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

    const user = newUsers[0];

    await session.commitTransaction();
    session.endSession();

    sendTokenResponse(user, 201, res, "User created successfully.");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");

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

    sendTokenResponse(user, 200, res, "User logged in successfully.");
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    let token = req.token;

    const existingBlacklist = await Blacklist.findOne({ token });
    if (!existingBlacklist) {
      await Blacklist.create({ token });
    }

    res.cookie("token", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      message: "User logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await req.user;

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
