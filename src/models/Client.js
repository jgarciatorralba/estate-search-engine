import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  avatar: {
    type: String,
    default: null,
  },
});

export const Client = mongoose.model("Client", ClientSchema);
