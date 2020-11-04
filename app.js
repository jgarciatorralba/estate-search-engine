// Import native node modules
import path from "path";

// Import dependencies
import express from "express";
import cors from "cors";
import fileupload from "express-fileupload"; // needed?

// Import config object
import config from "./src/config/app-config.js";

// Import routers
import router from "./src/router/main.js";

const app = express();

// Middlewares
app.use(cors({ origin: config.app.clientDomain }));
app.use(express.json());

app.use(fileupload()); // needed?

// Problems with CORS in Firefox?
// app.all("*", (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
// });

app.use("/", router);

// Allow "public" folder to serve static files
app.use(express.static(path.resolve() + "/public"));

// Run server
app.listen(config.app.port, () => {
  console.log(`Server started on port ${config.app.port}...`);
});
