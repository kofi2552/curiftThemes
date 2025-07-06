import initMiddleware from "./init-middleware";
import Cors from "cors";

// CORS middleware
const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "OPTIONS"],
    origin: process.env.ALLOWED_ORIGIN, // change to specific domain for production
    allowedHeaders: ["Content-Type"],
  })
);

export default cors;
