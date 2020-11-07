// Import native node modules
import path from "path";

// Import dependencies
import express from "express";

// Import models
import Purchase from "../models/Purchase.js";
import Client from "../models/Client.js";

// Import project files
import config from "../config/app-config.js";
import backendMiddleware from "../middlewares/backend.js";

const router = express.Router();

// Get all purchase history
router.get("/", backendMiddleware, async (req, res) => {
  let clients = await Client.findWithDeleted({});
  clients.forEach((client) => {
    client._doc.avatar =
      "http://" +
      path.posix.join(
        config.app.nodeServerDomain,
        "img",
        "user",
        client._doc.avatar
      );
  });
  let purchases = await Purchase.find({});
  purchases.forEach((purchase) => {
    clients.forEach((client) => {
      if (client._id.id.toString("hex") == purchase.buyer_id) {
        purchase._doc.buyer = client;
        delete purchase._doc.buyer_id;
      }
    });
  });
  res.json({ data: purchases, error: null });
});

// Get purchases by client id
router.get("/:client_id", backendMiddleware, async (req, res) => {
  const client = await Client.findById(req.params.client_id);
  if (client) {
    const purchases = await Purchase.find({ buyer_id: req.params.client_id });
    if (purchases.length == 0) {
      res.json({ data: "No purchase history for that client", error: null });
    } else {
      purchases.forEach((purchase) => {
        delete purchase._doc.buyer_id;
      });
    }
    client._doc.avatar =
      "http://" +
      path.posix.join(
        config.app.nodeServerDomain,
        "img",
        "user",
        client._doc.avatar
      );
    const responseData = {};
    responseData.purchases = purchases;
    responseData.client = client;
    res.json({ data: responseData, error: null });
  } else {
    return res.status(400).json({ data: null, error: "Client not found" });
  }
});

export default router;
