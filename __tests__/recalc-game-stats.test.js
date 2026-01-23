const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Game = require("../models/game");
const Review = require("../models/review");
const User = require("../models/user");
const recalcGameStats = require("../helpers/recalc-game-stats");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    dbName: "jest",
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Promise.all([
    Game.deleteMany({}),
    Review.deleteMany({}),
    User.deleteMany({}),
  ]);
});

test("sets reviewCount and averageRating to 0 when there are no reviews", async () => {
  const user = await User.create({ username: "gabo", password: "123" });

  const game = await Game.create({
    title: "Hades",
    genre: "Roguelike",
    platform: "PC",
    owner: user._id,
  });

  await recalcGameStats(game._id);

  const updated = await Game.findById(game._id);

  expect(updated.reviewCount).toBe(0);
  expect(updated.averageRating).toBe(0);
});

test("recalculates reviewCount and averageRating after multiple reviews", async () => {
  const owner = await User.create({ username: "owner", password: "123" });
  const u1 = await User.create({ username: "u1", password: "123" });
  const u2 = await User.create({ username: "u2", password: "123" });

  const game = await Game.create({
    title: "Celeste",
    genre: "Platformer",
    platform: "Switch",
    owner: owner._id,
  });

  await Review.create({
    rating: 5,
    comment: "Amazing",
    author: u1._id,
    game: game._id,
  });

  await Review.create({
    rating: 3,
    comment: "Good but hard",
    author: u2._id,
    game: game._id,
  });

  await recalcGameStats(game._id);

  const updated = await Game.findById(game._id);

  expect(updated.reviewCount).toBe(2);
  expect(updated.averageRating).toBeCloseTo(4, 5);
});

test("updates stats correctly after a review is deleted", async () => {
  const owner = await User.create({ username: "owner", password: "123" });
  const u1 = await User.create({ username: "u1", password: "123" });
  const u2 = await User.create({ username: "u2", password: "123" });

  const game = await Game.create({
    title: "Dead Cells",
    genre: "Roguelike",
    platform: "PC",
    owner: owner._id,
  });

  const r1 = await Review.create({
    rating: 4,
    comment: "Nice",
    author: u1._id,
    game: game._id,
  });

  const r2 = await Review.create({
    rating: 2,
    comment: "Not for me",
    author: u2._id,
    game: game._id,
  });

  await recalcGameStats(game._id);

  await Review.deleteOne({ _id: r2._id });
  await recalcGameStats(game._id);

  const updated = await Game.findById(game._id);

  expect(updated.reviewCount).toBe(1);
  expect(updated.averageRating).toBeCloseTo(4, 5);
});
