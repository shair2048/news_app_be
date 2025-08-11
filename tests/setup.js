import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";
import { afterAll, beforeAll } from "vitest";

beforeAll(async () => {
  await mongoose.connect(DB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});
