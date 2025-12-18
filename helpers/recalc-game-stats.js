const Game = require("../models/game.js");
const Review = require("../models/review.js");

async function recalcGameStats(gameId) {
  const reviews = await Review.find({ game: gameId });

  const reviewCount = reviews.length;

  const averageRating =
    reviewCount === 0
      ? 0
      : reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviewCount;

  await Game.updateOne({ _id: gameId }, { averageRating, reviewCount });
}

module.exports = recalcGameStats;
