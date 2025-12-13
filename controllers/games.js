const express = require("express");
const router = express.Router();

const Game = require("../models/game.js");

// INDEX PAGE
// GET /games
router.get("/", async (req, res) => {
  res.render("games/index.ejs");
});

module.exports = router;
