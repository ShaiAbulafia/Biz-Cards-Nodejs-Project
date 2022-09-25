const express = require("express");
const router = express.Router();
const joi = require("joi");
const auth = require("../middleware/auth");
const _ = require("lodash");
const Card = require("../models/Card");

// schema for card register request
const cardSchema = joi.object({
  name: joi.string().required().min(2).max(255),
  description: joi.string().required().min(6).max(255),
  adress: joi.string().required().min(6).max(255),
  phone: joi.string().required(),
  image: joi.string().required().min(10).max(255),
});

// register request for new card router
router.post("/", auth, async (req, res) => {
  try {
    // joi validation
    const { error } = cardSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    // generate and check if card number taken
    let cardGenNum;
    let cardCheck;
    do {
      cardGenNum = _.random(1, 10000);
      cardCheck = await Card.findOne({ cardNum: cardGenNum });
    } while (cardCheck);

    // creating new Card
    let card = new Card({
      name: req.body.name,
      description: req.body.description,
      adress: req.body.adress,
      phone: req.body.phone,
      image: req.body.image,
      userId: req.payload._id,
      cardNum: cardGenNum,
    });

    // saving card
    await card.save();

    // sending response
    res.status(201).send(card);
  } catch (err) {
    // sending error if occured
    res.status(400).send("Error in register new card " + err);
  }
});

// get specific card router
router.get("/:id", auth, async (req, res) => {
  try {
    // check if card exists
    let card = await Card.findById(req.params.id);
    if (!card) return res.status(404).send("Card doesnt exists");

    // sending response with card if exists
    res.status(200).send(card);
  } catch (err) {
    // sending error if occured
    res.status(400).send("Error in getting the card " + err);
  }
});

// put specific card router
router.put("/:id", auth, async (req, res) => {
  try {
    // joi vaildation
    const { error } = cardSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    // searching for the card card
    let card = await Card.findOne({ _id: req.params.id });
    if (!card) return res.status(404).send("Card doesnt exists");

    // check if user own the card
    if (card.userId != req.payload._id)
      return res.status(401).send("User doesnt own this card");

    // update card
    card = await Card.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    });

    // send respone if updated
    res.status(200).send(card);
  } catch (err) {
    res.status(400).send("Error in updating the card " + err);
  }
});

// delete specific card router
router.delete("/:id", auth, async (req, res) => {
  try {
    // searching for the card card
    let card = await Card.findOne({ _id: req.params.id });
    if (!card) return res.status(404).send("Card doesnt exists");

    // check if user own the card
    if (card.userId != req.payload._id)
      return res.status(401).send("User doesnt own this card");

    //delete card
    card = await Card.findOneAndRemove({ _id: req.params.id });

    // sending response if card was deleted
    res.status(200).send("Card delteted");
  } catch (err) {
    // sending error if occured
    res.status(400).send("Error in deleting the card " + err);
  }
});

// get all of this user card router
router.get("/", auth, async (req, res) => {
  try {
    // get all the card
    let card = await Card.find({ userId: req.payload._id });

    // sending response with array of users card
    res.status(200).send(card);
  } catch (err) {
    // sending error if occured
    res.status(400).send("Error in getting your cards " + err);
  }
});

module.exports = router;
