// Import native node modules
import path from "path";

// Import dependencies
import express from "express";
import bcrypt from "bcrypt";

// Import controller
import clientController from "../controllers/client.js";

// Import project files
import config from "../config/app-config.js";
import authMiddleware from "../middlewares/auth.js";
import avatarMiddleware from "../middlewares/avatar.js";

const router = express.Router();

router.use(authMiddleware);

// CRUD over clients (by themselves in the "profile" section)

// Get a client
router.get("/", async (req, res) => {
  const clientId = req.user.id;
  const client = await clientController.findById(clientId);
  if (client) {
    client.avatar =
      "http://" +
      path.posix.join(
        config.app.nodeServerDomain,
        "img",
        "user",
        client.avatar
      );
    res.json({ data: client, error: null });
  } else {
    return res.status(400).json({ data: null, error: "Client not found" });
  }
});

// Update a client
router.patch("/", avatarMiddleware.single("avatar"), async (req, res) => {
  const updatedClient = {};
  if (req.body.email && req.body.email !== "")
    updatedClient.email = req.body.email;
  if (req.body.password && req.body.password !== "")
    updatedClient.password = await bcrypt.hash(
      req.body.password,
      config.app.saltRounds
    );
  if (req.body.username && req.body.username !== "")
    updatedClient.username = req.body.username;
  if (req.file) updatedClient.avatar = req.file.filename;

  const deletedClient = await clientController.findDeletedById(req.user.id);
  if (deletedClient) {
    return res
      .status(400)
      .json({ data: null, error: "Client account was deactivated" });
  } else {
    const error = await clientController.updateClientById(
      req.user.id,
      updatedClient
    );
    if (error) {
      if (error.name == "MongoError") {
        if (Object.keys(error.keyValue).includes("email"))
          return res
            .status(400)
            .json({ data: null, error: "That email is already taken" });
        if (Object.keys(error.keyValue).includes("username"))
          return res
            .status(400)
            .json({ data: null, error: "That username is already taken" });
      } else {
        return res
          .status(500)
          .json({ data: null, error: "Internal Server Error" });
      }
    } else {
      res.json({ data: "Client data updated!", error: null });
    }
  }
});

// Delete a client
router.delete("/", async (req, res) => {
  const client = await clientController.findById(req.user.id);
  if (client) {
    const error = await clientController.deleteClient(client);
    if (error) {
      return res
        .status(500)
        .json({ data: null, error: "Internal Server Error" });
    } else {
      res.json({ data: "Client deleted!", error: null });
    }
  } else {
    return res.status(400).json({ data: null, error: "Client not found" });
  }
});

export default router;
