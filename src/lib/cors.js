import initMiddleware from "./init-middleware";
import Cors from "cors";

// CORS middleware
const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "OPTIONS"],
    // origin: [
    //   "http://localhost",
    //   "http://127.0.0.1",
    //   "http://127.0.0.1:3000",
    //   "http://localhost:3000",
    //   "http://localhost/wordpress",
    //   "http://localhost/wordpress/wp-admin/",
    // ],
    origin: process.env.ALLOWED_ORIGIN,
    allowedHeaders: ["Content-Type"],
  })
);

export default cors;
