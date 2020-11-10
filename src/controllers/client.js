// Import dependencies
import bcrypt from "bcrypt";

// Import models
import Client from "../models/Client.js";

// Import config object
import config from "../config/app-config.js";

export default {
  create: async function (clientObj) {
    const newClient = new Client({
      email: clientObj.email,
      password: await bcrypt.hash(clientObj.password, config.app.saltRounds),
      username: clientObj.username,
    });

    try {
      await newClient.save();
    } catch (error) {
      return error;
    }

    return null;
  },

  findByEmail: async function (email) {
    const client = await Client.findOne({ email: email });
    return client;
  },

  findById: async function (id) {
    const client = await Client.findOne({ _id: id }, [
      "_id",
      "email",
      "username",
      "avatar",
    ]);
    return client;
  },

  findDeletedById: async function (id) {
    const deletedClient = await Client.findOneDeleted({ _id: id });
    return deletedClient;
  },

  findWithDeletedById: async function (id) {
    const client = await Client.findOneWithDeleted({ _id: id });
    return client;
  },

  findAllWithDeleted: async function () {
    const allClients = await Client.findWithDeleted({});
    return allClients;
  },

  updateClientById: async function (id, clientObj) {
    try {
      await Client.updateOne({ _id: id }, clientObj);
    } catch (error) {
      return error;
    }

    return null;
  },

  deleteClient: async function (clientObj) {
    try {
      await clientObj.delete();
    } catch (error) {
      return error;
    }

    return null;
  },
};
