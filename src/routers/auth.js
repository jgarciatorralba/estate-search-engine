// Import native node modules
import path from "path";

// Import dependencies
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Import controller
import clientController from "../controllers/client.js";

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

  const error = await clientController.create({
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
  });

  if (error) {
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
  } else {
    res.json({
      data: "Congratulations, you have been successfully registered!",
      error: null,
    });
  }
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

  const client = await clientController.findByEmail(credentials.email);
  if (client == null)
    return res.status(400).json({
      data: null,
      error: "That email is not registered or was deactivated",
    });

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
