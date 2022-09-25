const express = require("express");
const router = express.Router();
const joi = require("joi");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// schema for register request
const registerSchema = joi.object({
  name: joi.string().required().min(2),
  email: joi.string().required().email().min(6),
  password: joi.string().required().min(8),
  biz: joi.boolean().required(),
});

// register request router
router.post("/", async (req, res) => {
  try {
    // joi validation
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    // check if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) res.status(400).send("User already exists");

    // creating new user
    user = new User(req.body);

    // crypting password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // generating token
    const genToken = jwt.sign(
      { _id: user._id, biz: user.biz },
      process.env.jwtKey
    );

    // saving user details
    await user.save();
    // sending response
    res.status(201).send({ token: genToken });
  } catch (err) {
    res.status(400).send("Error in register" + err);
  }
});

module.exports = router;
