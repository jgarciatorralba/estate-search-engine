import mongoose from "mongoose";
import config from "../config/app-config.js";

export default class {
  connect() {
    return new Promise((resolve, reject) => {
      mongoose
        .connect(
          `mongodb+srv://${config.db.user}:${config.db.pass}@${config.db.cluster}.z1ipk.mongodb.net/${config.db.name}`,
          {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            useCreateIndex: true,
            w: "majority",
          }
        )
        .then(() => resolve("MongoDB connected..."))
        .catch((error) => reject(error));
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      mongoose.connection
        .close()
        .then(() => resolve("MongoDB connection closed..."))
        .catch((error) => reject(error));
    });
  }
}
