const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  adress: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  phone: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 255,
  },
  userId: {
    type: String,
    required: true,
  },
  cardNum: {
    type: Number,
    required: true,
  },
});

const Card = mongoose.model("cards", cardSchema);
module.exports = Card;
