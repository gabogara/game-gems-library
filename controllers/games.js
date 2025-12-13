const express = require("express");
const router = express.Router();

const Game = require("../models/game.js");

// INDEX PAGE
// GET /games
router.get("/", async (req, res) => {
  try {
    res.locals.games = await Game.find({ owner: req.session.user._id });
    res.render("games/index.ejs");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
