import { Router } from "express";
import { signUp, signIn } from "../controllers/auth.controllers.js";
import { check } from "express-validator";
import validate from "../middlewares/validate.middleware.js";

const authRoute = Router();

authRoute.post(
  "/sign-up",
  check("name")
    .notEmpty()
    .withMessage("Please fill your name")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be at least 3 characters long"),
  check("email")
    .notEmpty()
    .withMessage("Please fill your email")
    .bail()
    .isEmail()
    .withMessage("Please fill a valid email address")
    .normalizeEmail(),
  check("password")
    .notEmpty()
    .withMessage("Please fill your password")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  validate,
  signUp
);
authRoute.post(
  "/sign-in",
  check("email")
    .notEmpty()
    .withMessage("Please fill your email")
    .bail()
    .isEmail()
    .withMessage("Please fill a valid email address")
    .normalizeEmail(),
  check("password").notEmpty().withMessage("Please fill your password"),
  validate,
  signIn
);

export default authRoute;
