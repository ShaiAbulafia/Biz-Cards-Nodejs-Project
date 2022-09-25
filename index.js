// api config
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

// setting the router
const register = require("./routes/register");
const login = require("./routes/login");
const profile = require("./routes/profile");
const cards = require("./routes/cards");
const allCards = require("./routes/allCards");

// setting PORT
const PORT = process.env.PORT || 8000;

// using json
app.use(express.json());

// setting the routes
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/profile", profile);
app.use("/api/cards", cards);
app.use("/api/allCards", allCards);

// cors
app.use(cors());

// connect to mongoDB
mongoose
  .connect(process.env.dbString, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(err));

// running
app.listen(PORT, () => console.log("Server started on port", PORT));
