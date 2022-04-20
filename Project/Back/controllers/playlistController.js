const users = require("../models/users");

exports.addSongToPlaylist = (req, res, next) => {
  res
    .status(200)
    .json(users.addSongToPlaylist(req.params.userId, req.params.songId));
};

exports.getPlayListSong = (req, res, next) => {
  res.status(200).json(users.getPlayListSong(req.params.userId));
};

exports.deleteSongToPlaylist = (req, res, next) => {
  res
    .status(200)
    .json(users.deleteSongToPlaylist(req.params.userId, req.params.songId));
};
