import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  NODE_ENV,
  DB_URI,
  CLIENT_URL,
  GEMINI_API_KEY,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  LIVEBLOCKS_SECRET_KEY,
} = process.env;
