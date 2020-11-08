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

// Get all existing properties

// Get details for a given property

// Get newly created properties (last 24h)

/** Get properties with filters:
 * Type of property: "Home" or "Office"
 * Type of home: "Flat/Apartment", "House", "Duplex", "Penthouse"
 * numBedrooms: "1", "2", "3", "4 or +"
 * numBathrooms: "1", "2", "3 or +"
 * Equipment: "Indifferent", "Fully fitted kitchen", "Furnished"
 * Condition: "New", "Good condition", "Needs renovation"
 * Building use: "Private", "Co-working", "Security System"
 * Price: min and max
 * Location: latitude and longitude
 * publicationDate: last 24h, last week, last month
 * Services: "Pets allowed", "Lift", "Air conditioning", "Garden", "Swimming pool", "Terrace"
 */

export default router;
