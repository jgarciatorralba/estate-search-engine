// Import native node modules
import path from "path";

// Import dependencies
import express from "express";

// Import controllers
import clientController from "../controllers/client.js";
import purchaseController from "../controllers/purchase.js";

// Import project files
import config from "../config/app-config.js";
import backendMiddleware from "../middlewares/backend.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// Get all purchase history
router.get("/", backendMiddleware, async (req, res) => {
  let clients = await clientController.findAllWithDeleted();
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
  let purchases = await purchaseController.findAll();
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
  const client = await clientController.findWithDeletedById(
    req.params.client_id
  );
  if (client) {
    const purchases = await purchaseController.findPurchasesByBuyerId(
      req.params.client_id
    );
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

// Post new purchase by client
router.post("/", authMiddleware, async (req, res) => {
  let purchaseObj = {};

  purchaseObj.buyer_id = req.user.id;
  purchaseObj.description = req.body.description;
  purchaseObj.price = req.body.price;
  purchaseObj.images = req.body.images;
  purchaseObj.services = req.body.services;
  purchaseObj.location = req.body.location;
  purchaseObj.publicationDate = Date.parse(req.body.publicationDate);
  purchaseObj.propertyType = req.body.propertyType;
  if (purchaseObj.propertyType == "Home") {
    purchaseObj.homeType = req.body.homeType;
    purchaseObj.numBedrooms = req.body.numBedrooms;
    purchaseObj.numBathrooms = req.body.numBathrooms;
    purchaseObj.equipment = req.body.equipment;
    purchaseObj.condition = req.body.condition;
  } else if (purchaseObj.propertyType == "Office") {
    purchaseObj.buildingUse = req.body.buildingUse;
  }

  const error = await purchaseController.create(purchaseObj);

  if (error) {
    return res.status(400).json({ data: null, error: "Error: " + error });
  }

  res.json({
    data: "Purchase was successfully registered.",
    error: null,
  });
});

export default router;
