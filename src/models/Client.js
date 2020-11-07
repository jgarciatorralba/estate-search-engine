import mongoose from "mongoose";
import validator from "validator";
import mongoose_delete from "mongoose-delete";

const ClientSchema = new mongoose.Schema(
  {
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
    avatar: {
      type: String,
      default: "default.jpg",
    },
  },
  {
    timestamps: true,
  }
);

ClientSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: true,
});

const Client = mongoose.model("Client", ClientSchema);

export default Client;
