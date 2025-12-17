const express = require("express");
const router = express.Router();

const User = require("../models/user.js");

router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id).populate(
      "favorites"
    );
    res.locals.games = user.favorites;
    res.render("favorites/index.ejs");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
