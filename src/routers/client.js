import express from "express";
import bcrypt from "bcrypt";
import authMiddleware from "../middlewares/auth.js";
import avatarMiddleware from "../middlewares/avatar.js";
import Client from "../models/Client.js";
import config from "../config/app-config.js";
import path from "path";

const router = express.Router();

router.use(authMiddleware);

// CRUD over clients (by themselves in the "profile" section)

// Get a client
router.get("/", async (req, res) => {
  const clientId = req.user.id;
  const client = await Client.findOne({ _id: clientId }, [
    "_id",
    "email",
    "username",
    "avatar",
  ]);
  client.avatar =
    "http://" +
    path.posix.join(config.app.nodeServerDomain, "img", "user", client.avatar);
  res.json({ data: client, error: null });
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
  await Client.updateOne({ _id: req.user.id }, updatedClient);
  res.json({ data: "Client data updated!", error: null });
});

// Delete a client
router.delete("/", async (req, res) => {
  const clientId = req.user.id;
  await Client.deleteOne({ _id: clientId });
  res.json({ data: "Client deleted!", error: null });
});

export default router;
