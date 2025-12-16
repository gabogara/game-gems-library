const express = require("express");
const router = express.Router();

const Game = require("../models/game.js");

// COMMUNITY GAMERS HOME
// GET /
router.get("/", async (req, res) => {
  try {
    res.locals.games = await Game.find({ owner: { $ne: req.session.user._id } })
      .populate("owner", "username")
      .sort({ createdAt: -1 });

    res.render("index.ejs");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
