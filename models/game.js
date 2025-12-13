const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    genre: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Action",
        "Adventure",
        "Action-Adventure",
        "RPG",
        "JRPG",
        "Strategy",
        "Tactical",
        "Shooter",
        "Platformer",
        "Puzzle",
        "Fighting",
        "Racing",
        "Simulation",
        "Sports",
        "Horror",
        "Metroidvania",
        "Roguelike",
        "Indie",
        "Other",
      ],
    },
    platform: { type: String, trim: true },
    releaseYear: Number,
    reviewCount: { type: Number, default: 0 },
    description: String,
    coverImageUrl: String,
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
