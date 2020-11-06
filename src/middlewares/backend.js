import config from "../config/app-config.js";

export default function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const secret = authHeader && authHeader.split(" ")[1];

  if (secret == null) {
    return res
      .status(401)
      .json({ data: null, error: "Unauthorized: Missing API Secret" });
  }

  if (secret !== config.app.apiSecret) {
    return res
      .status(403)
      .json({ data: null, error: "Forbidden: Invalid API Secret" });
  }

  next();
}
