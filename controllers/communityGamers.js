const express = require("express");
const router = express.Router();

const Game = require("../models/game.js");
const User = require("../models/user.js");

// COMMUNITY GAMERS HOME
// GET /
router.get("/", async (req, res) => {
  try {
    const q = req.query.q;
    const genre = req.query.genre;
    const platform = req.query.platform;
    const sort = req.query.sort;

    const filter = {
      owner: { $ne: req.session.user._id },
    };

    if (q && q.trim() !== "") {
      filter.title = { $regex: q, $options: "i" };
    }

    if (genre && genre.trim() !== "") {
      filter.genre = genre;
    }

    if (platform && platform.trim() !== "") {
      filter.platform = { $regex: platform, $options: "i" };
    }

    let sortObj = { createdAt: -1 };

    if (sort === "rating") {
      sortObj = {
        averageRating: -1,
        reviewCount: -1,
        createdAt: -1,
      };
    }

    const games = await Game.find(filter)
      .populate("owner", "username _id")
      .sort(sortObj);

    const user = await User.findById(req.session.user._id);

    let favoriteIds;
    if (user && user.favorites) {
      favoriteIds = user.favorites.map((id) => String(id));
    } else {
      favoriteIds = [];
    }

    const filters = {
      q: q || "",
      genre: genre || "",
      platform: platform || "",
      sort: sort || "",
    };

    res.render("index.ejs", {
      games: games,
      favoriteIds: favoriteIds,
      filters: filters,
      currentPath: req.originalUrl,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
