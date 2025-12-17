import cors from "cors";
import { CLIENT_URL } from "../../configs/env.js";

const corsOptions = {
  origin: CLIENT_URL, // Allowed origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed request methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed request headers
  credentials: true,
};

export default cors(corsOptions);
