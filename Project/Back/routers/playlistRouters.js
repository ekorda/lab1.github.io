const express = require("express");
const playlistController = require("../controllers/playlistController");
const router = express.Router();

router.post("/:songId/users/:userId", playlistController.addSongToPlaylist);
router.get("/users/:userId", playlistController.getPlayListSong);
router.delete(
  "/:songId/users/:userId",
  playlistController.deleteSongToPlaylist
);

module.exports = router;
