// Import native node modules
import path from "path";

// Import dependencies
import express from "express";
import cors from "cors";

// Import project files
import config from "./config/app-config.js";
import authRouter from "./routers/auth.js";
import clientRouter from "./routers/client.js";
import purchaseRouter from "./routers/purchase.js";
import propertyRouter from "./routers/property.js";

const app = express();

// General use middlewares
app.use(
  cors({ origin: [config.app.clientDomain, config.app.laravelServerDomain] })
);
app.use(express.json());

// Routers
app.use("/", authRouter);
app.use("/client", clientRouter);
app.use("/purchase", purchaseRouter);
app.use("/property", propertyRouter);

// Allow "public" folder to serve static files
app.use(express.static(path.resolve() + "/public"));

export default app;
