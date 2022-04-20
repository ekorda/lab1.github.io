const songs = require("../models/songs");

exports.getSongs = (req, res, next) => {
  res.status(200).json(songs.getSongs());
};
