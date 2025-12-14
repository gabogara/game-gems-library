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

// NEW Game Page
// GET /games/new
router.get("/new", (req, res) => {
  res.render("games/new.ejs");
});

// CREATE GAME
// POST /games
router.post("/", async (req, res) => {
  try {
    req.body.owner = req.session.user._id;
    await Game.create(req.body);
    res.redirect("/games");
  } catch (error) {
    console.log(error);
    res.redirect("/games/new");
  }
});

// SHOW GAMES PAGE
// GET /games/:gameId
router.get("/:gameId", async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);
    res.locals.game = game;
    res.render("games/show.ejs");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// DELETE GAME
// DELETE /games/:gameId
router.delete("/:gameId", async (req, res) => {
  try {
    const result = await Game.deleteOne({
      _id: req.params.gameId,
      owner: req.session.user._id,
    });
    res.redirect("/games");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});
module.exports = router;
