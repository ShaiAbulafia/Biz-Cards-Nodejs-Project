const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const _ = require("lodash");

// get user details request router
router.get("/", auth, async (req, res) => {
  try {
    // searching for user
    let user = await User.findById(req.payload._id);

    // send response if no user found
    if (!user) return res.status(404).send("Wrong info");

    // send user details
    res.status(200).send(_.pick(user, ["_id", "name", "email", "biz"]));
  } catch (err) {
    // sending error if occured
    res.status(400).send("Error in profile " + err);
  }
});

module.exports = router;
