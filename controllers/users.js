const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const Game = require("../models/game.js");
const Review = require("../models/review.js");

// USER PROFILE
// GET /users/:userId
router.get("/:userId", async (req, res) => {
  try {
    res.locals.profileUser = await User.findById(req.params.userId);

    res.locals.games = await Game.find({ owner: req.params.userId }).sort({
      createdAt: -1,
    });

    res.locals.reviews = await Review.find({ author: req.params.userId })
      .populate("game", "title")
      .sort({ createdAt: -1 });

    res.render("users/show.ejs");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// EDIT PROFILE PAGE
// GET /users/me/edit
router.get("/me/edit", async (req, res) => {
  try {
    res.locals.profileUser = await User.findById(req.session.user._id);
    res.render("users/edit.ejs");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// UPDATE PROFILE
// PUT /users/me
router.put("/me", async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.session.user._id },
      { bio: req.body.bio, favoriteGenre: req.body.favoriteGenre }
    );

    res.redirect(`/users/${req.session.user._id}`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
