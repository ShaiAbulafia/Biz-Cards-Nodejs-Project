const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Card = require("../models/Card");

// get all card router
router.get("/", auth, async (req, res) => {
  try {
    // get all the card
    let card = await Card.find({});

    // sending response with array of all existing cards
    res.status(200).send(card);
  } catch (err) {
    // sending error if occured
    res.status(400).send("Error in getting all the cards " + err);
  }
});

module.exports = router;
