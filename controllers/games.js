const express = require("express");
const router = express.Router();

const Game = require("../models/game.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");

// INDEX PAGE
// GET /games
router.get("/", async (req, res) => {
  try {
    res.locals.games = await Game.find({ owner: req.session.user._id });

    const user = await User.findById(req.session.user._id);
    res.locals.favoriteIds = (user.favorites || []).map(String);

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

// EDIT REVIEW PAGE
// GET /games/:gameId/reviews/:reviewId/edit
router.get("/:gameId/reviews/:reviewId/edit", async (req, res) => {
  try {
    res.locals.game = await Game.findById(req.params.gameId);

    res.locals.review = await Review.findOne({
      _id: req.params.reviewId,
      author: req.session.user._id,
      game: req.params.gameId,
    });

    if (!res.locals.review) {
      return res.redirect(`/games/${req.params.gameId}`);
    }

    res.render("reviews/edit.ejs");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// UPDATE REVIEW
// PUT /games/:gameId/reviews/:reviewId
router.put("/:gameId/reviews/:reviewId", async (req, res) => {
  try {
    await Review.updateOne(
      {
        _id: req.params.reviewId,
        author: req.session.user._id,
        game: req.params.gameId,
      },
      {
        rating: req.body.rating,
        comment: req.body.comment,
        playedOn: req.body.playedOn,
      }
    );
    res.redirect(`/games/${req.params.gameId}`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// DELETE REVIEW
// DELETE /games/:gameId/reviews/:reviewId
router.delete("/:gameId/reviews/:reviewId", async (req, res) => {
  try {
    await Review.deleteOne({
      _id: req.params.reviewId,
      author: req.session.user._id,
      game: req.params.gameId,
    });
    res.redirect(`/games/${req.params.gameId}`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// ADD FAVORITE
router.post("/:gameId/favorite", async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.session.user._id },
      { $addToSet: { favorites: req.params.gameId } }
    );

    return res.redirect(req.body.next || `/games/${req.params.gameId}`);
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
});

// REMOVE FAVORITE
router.post("/:gameId/unfavorite", async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.session.user._id },
      { $pull: { favorites: req.params.gameId } }
    );

    return res.redirect(req.body.next || `/games/${req.params.gameId}`);
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
});

// CREATE REVIEW
// POST /games/:gameId/reviews
router.post("/:gameId/reviews", async (req, res) => {
  try {
    const existing = await Review.findOne({
      game: req.params.gameId,
      author: req.session.user._id,
    });

    if (existing) {
      return res.redirect(`/games/${req.params.gameId}`);
    }

    req.body.author = req.session.user._id;
    req.body.game = req.params.gameId;

    await Review.create(req.body);
    res.redirect(`/games/${req.params.gameId}`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
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

    res.locals.myReview = await Review.findOne({
      game: req.params.gameId,
      author: req.session.user._id,
    });

    const user = await User.findById(req.session.user._id);

    const favorites = user.favorites || [];
    res.locals.isFavorite = favorites
      .map(String)
      .includes(String(req.params.gameId));

    res.render("games/show.ejs");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
