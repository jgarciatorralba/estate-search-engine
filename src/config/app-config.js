// Import native node modules
import fs from "fs";
// Import dependencies
import dotenv from "dotenv";

const result = dotenv.config();

if (result.error) {
  console.log("⚠️ Couldn't find .env file, creating one from .env.example");
  fs.copyFileSync(".env.example", ".env");
  dotenv.config();
}

export default {
  app: {
    port: parseInt(process.env.APP_PORT),
    saltRounds: parseInt(process.env.SALT_ROUNDS),
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    apiSecret: process.env.API_SECRET,
    nodeServerDomain: process.env.NODE_SERVER_DOMAIN,
    laravelServerDomain: process.env.LARAVEL_SERVER_DOMAIN,
    clientDomain: process.env.CLIENT_DOMAIN,
  },
  db: {
    cluster: process.env.DB_CLUSTER,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME,
  },
};
