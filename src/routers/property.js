// Import native node modules
import path from "path";

// Import dependencies
import express from "express";

// Import project files
import config from "../config/app-config.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.use(authMiddleware);

//TODO: requests from front-end to be forwarded to back-end

export default router;
