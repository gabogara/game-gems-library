const express = require("express");
const router = express.Router();

const Game = require("../models/game.js");
const Review = require("../models/review.js");

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

// EDIT GAME PAGE
// GET /games/:gameId/edit
router.get("/:gameId/edit", async (req, res) => {
  try {
    res.locals.game = await Game.findById(req.params.gameId);
    res.render("games/edit.ejs");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// UPDATE GAME
// PUT /games/:gameId
router.put("/:gameId", async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);
    game.title = req.body.title;
    game.genre = req.body.genre;
    game.platform = req.body.platform;
    game.releaseYear = req.body.releaseYear;
    game.description = req.body.description;
    game.coverImageUrl = req.body.coverImageUrl;

    await game.save();
    res.redirect(`/games/${game._id}`);
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

// SHOW GAMES PAGE
// GET /games/:gameId
router.get("/:gameId", async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);
    res.locals.game = game;

    res.locals.reviews = await Review.find({ game: req.params.gameId })
    .populate("author", "username")
    .sort({ createdAt: -1 });
    res.render("games/show.ejs");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
