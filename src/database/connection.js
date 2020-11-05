import mongoose from "mongoose";
import config from "../config/app-config.js";

export default class {
  connect() {
    mongoose
      .connect(
        `mongodb+srv://${config.db.user}:${config.db.pass}@${config.db.cluster}.z1ipk.mongodb.net/${config.db.name}`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          retryWrites: true,
          w: "majority",
        }
      )
      .then(() => console.log("MongoDB connected..."))
      .catch((error) => console.log(error));
  }
}
