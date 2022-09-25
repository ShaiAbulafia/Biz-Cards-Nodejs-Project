const express = require("express");
const router = express.Router();
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// schema for login request
const loginSchema = joi.object({
  email: joi.string().required().email().min(6),
  password: joi.string().required().min(8),
});

// login request router
router.post("/", async (req, res) => {
  try {
    // joi validation
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    // check if user exists
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("Wrong password or email");

    // checking if password match
    const compareResult = await bcrypt.compare(
      req.body.password,
      user.password
    );

    // send response of wrong details if password match failed
    if (!compareResult) return res.status(404).send("Wrong password or email");

    // generating token
    const genToken = jwt.sign(
      { _id: user._id, biz: user.biz },
      process.env.jwtKey
    );

    // sending response
    res.status(200).send({ token: genToken });
  } catch (err) {
    // sending error if occured
    res.status(400).send("Error in login " + err);
  }
});

module.exports = router;
