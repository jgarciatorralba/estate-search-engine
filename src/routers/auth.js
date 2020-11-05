// Import native node modules
import path from "path";

// Import dependencies
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Import models
import Client from "../models/Client.js";

// Import config object
import config from "../config/app-config.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  if (req.body.email == null) {
    return res
      .status(400)
      .json({ data: null, error: "Bad Request: Missing email attribute" });
  }

  if (req.body.password == null) {
    return res
      .status(400)
      .json({ data: null, error: "Bad Request: Missing password attribute" });
  }

  if (req.body.username == null) {
    return res
      .status(400)
      .json({ data: null, error: "Bad Request: Missing name attribute" });
  }

  const newClient = new Client({
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, config.app.saltRounds),
    username: req.body.username,
  });

  try {
    await newClient.save();
  } catch (error) {
    if (error.name == "ValidationError") {
      return res
        .status(400)
        .json({ data: null, error: error.errors["email"].message });
    }
    if (error.name == "MongoError") {
      if (Object.keys(error.keyValue).includes("email"))
        return res
          .status(400)
          .json({ data: null, error: "That email is already taken" });
      if (Object.keys(error.keyValue).includes("username"))
        return res
          .status(400)
          .json({ data: null, error: "That username is already taken" });
    }
    return res.status(500).json({ data: null, error: "Internal Server Error" });
  }

  res.json({
    data: "Congratulations, you have been successfully registered!",
    error: null,
  });
});

router.post("/login", async (req, res) => {
  const credentials = req.body;

  if (credentials.email == null) {
    return res
      .status(400)
      .json({ data: null, error: "Bad Request: Missing email attribute" });
  }

  if (credentials.password == null) {
    return res
      .status(400)
      .json({ data: null, error: "Bad Request: Missing password attribute" });
  }

  const client = await Client.findOne({ email: credentials.email });
  if (client == null)
    return res
      .status(400)
      .json({ data: null, error: "That email doesn't exist" });

  const match = await bcrypt.compare(credentials.password, client.password);
  if (!match)
    return res.status(400).json({ data: null, error: "Password incorrect" });

  const accessToken = jwt.sign(
    { id: client._id },
    config.app.accessTokenSecret
  );

  const data = {
    accessToken: accessToken,
    client: {
      email: client.email,
      username: client.username,
      avatar:
        "http://" +
        path.posix.join(
          config.app.nodeServerDomain,
          "img",
          "user",
          client.avatar
        ),
    },
  };

  res.json({ data: data, error: null });
});

export default router;
