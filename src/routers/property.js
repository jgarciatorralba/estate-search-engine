// Import native node modules
import querystring from "querystring";

// Import dependencies
import express from "express";
import axios from "axios";

// Import project files
import config from "../config/app-config.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.use(authMiddleware);

// Get all existing properties
router.get("/", async (req, res) => {
  try {
    const properties = await axios.get(
      config.app.laravelServerDomain + "/product",
      {
        headers: {
          Authorization: "Bearer " + config.app.apiSecret,
        },
      }
    );
    res.json({ data: properties, error: null });
  } catch (error) {
    return res.status(400).json({ data: null, error: "Error: " + error });
  }

  // Testing only
  // res.json({ data: "test route '/property'", error: null });
});

// Get newly created properties (last 24h)
router.get("/new", async (req, res) => {
  try {
    const properties = await axios.get(
      config.app.laravelServerDomain + "/product/new",
      {
        headers: {
          Authorization: "Bearer " + config.app.apiSecret,
        },
      }
    );
    res.json({ data: properties, error: null });
  } catch (error) {
    return res.status(400).json({ data: null, error: "Error: " + error });
  }

  // Testing only
  // res.json({ data: "test route '/property/new'", error: null });
});

// Get details for a given property
router.get("/detail/:property_id", async (req, res) => {
  try {
    const property = await axios.get(
      config.app.laravelServerDomain +
        "/product/detail/" +
        req.params.property_id,
      {
        headers: {
          Authorization: "Bearer " + config.app.apiSecret,
        },
      }
    );
    res.json({ data: property, error: null });
  } catch (error) {
    return res.status(400).json({ data: null, error: "Error: " + error });
  }

  // Testing only
  // res.json({
  //   data: "test route '/property/detail/" + req.params.property_id + "'",
  //   error: null,
  // });
});

// Get properties with filters
router.get("/filter", async (req, res) => {
  const url = new URL(
    "http://" + config.app.nodeServerDomain + req.originalUrl
  );
  let searchStr = url.search;

  try {
    const properties = await axios.get(
      config.app.laravelServerDomain + "/product/filter" + searchStr,
      {
        headers: {
          Authorization: "Bearer " + config.app.apiSecret,
        },
      }
    );
    res.json({ data: properties, error: null });
  } catch (error) {
    return res.status(400).json({ data: null, error: "Error: " + error });
  }

  // Testing only
  // searchStr = searchStr.substring(1);
  // const queryParams = querystring.parse(searchStr);
  // res.json({ data: queryParams, error: null });
});

export default router;
