import cors from "cors";
import { CLIENT_URL } from "../../configs/env.js";

const allowedOrigins = CLIENT_URL.split(",").map((url) => url.trim());

const corsOptions = {
  origin: allowedOrigins, // Allowed origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed request methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed request headers
  credentials: true,
};

export default cors(corsOptions);
