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
import authMiddleware from "../middlewares/auth.js";

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

// Post new purchase by client
router.post("/", authMiddleware, async (req, res) => {
  const buyer_id = req.user.id;
  const description = req.body.description;
  const price = req.body.price;
  const images = req.body.images;
  const services = req.body.services;
  const location = req.body.location;
  const publicationDate = Date.parse(req.body.publicationDate);
  const propertyType = req.body.propertyType;
  let homeType = "";
  let numBedrooms = "";
  let numBathrooms = "";
  let equipment = "";
  let condition = "";
  let buildingUse = "";
  if (propertyType == "Home") {
    homeType = req.body.homeType;
    numBedrooms = req.body.numBedrooms;
    numBathrooms = req.body.numBathrooms;
    equipment = req.body.equipment;
    condition = req.body.condition;
  } else if (propertyType == "Office") {
    buildingUse = req.body.buildingUse;
  }

  let newPurchase;
  if (propertyType == "Home") {
    newPurchase = new Purchase({
      buyer_id: buyer_id,
      description: description,
      price: price,
      propertyType: propertyType,
      images: images,
      services: services,
      location: location,
      publicationDate: publicationDate,
      homeType: homeType,
      numBedrooms: numBedrooms,
      numBathrooms: numBathrooms,
      equipment: equipment,
      condition: condition,
    });
  } else if (propertyType == "Office") {
    newPurchase = new Purchase({
      buyer_id: buyer_id,
      description: description,
      price: price,
      propertyType: propertyType,
      images: images,
      services: services,
      location: location,
      publicationDate: publicationDate,
      buildingUse: buildingUse,
    });
  }

  try {
    await newPurchase.save();
  } catch (error) {
    return res.status(400).json({ data: null, error: "Error: " + error });
  }

  res.json({
    data: "Purchase was successfully registered.",
    error: null,
  });
});

export default router;
