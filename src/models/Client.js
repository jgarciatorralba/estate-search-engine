import mongoose from "mongoose";
import validator from "validator";

const ClientSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Invalid email format"],
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

const Client = mongoose.model("Client", ClientSchema);

export default Client;
