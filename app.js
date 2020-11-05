// Import native node modules
import path from "path";

// Import dependencies
import express from "express";
import cors from "cors";

// Import project files
import config from "./src/config/app-config.js";
import Database from "./src/database/connection.js";

import authRouter from "./src/routers/auth.js";

const app = express();

// DB Connection
const db = new Database();
db.connect();

// Middlewares
app.use(
  cors({ origin: [config.app.clientDomain, config.app.laravelServerDomain] })
);
app.use(express.json());

app.use("/", authRouter);

// Allow "public" folder to serve static files
app.use(express.static(path.resolve() + "/public"));

// Run server
app.listen(config.app.port, () => {
  console.log(`Server started on port ${config.app.port}...`);
});
