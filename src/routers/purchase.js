// Import native node modules
import path from "path";

// Import dependencies
import express from "express";

// Import models
import Purchase from "../models/Purchase.js";

// Import project files
import config from "../config/app-config.js";
import backendMiddleware from "../middlewares/backend.js";

const router = express.Router();

router.use(backendMiddleware);

// Get all purchases history
router.get("/", async (req, res) => {
  const purchases = await Purchase.find({});
  res.json({ data: purchases, error: null });
});

export default router;
