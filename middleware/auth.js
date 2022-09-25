const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // get token from request header
    let token = req.header("Authorization");

    // if no token send response
    if (!token) return res.status(401).send("Access denied, no token.");

    // save token in request payload
    let payload = jwt.verify(token, process.env.jwtKey);
    req.payload = payload;

    // continue
    next();
  } catch (error) {
    // sending error if occured
    res.status(400).send("Invalid token");
  }
};
