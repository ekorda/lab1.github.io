const express = require("express");
const userRouters = require("./routers/userRouters");
const songRouters = require("./routers/songRouters");
const playlistRouters = require("./routers/playlistRouters");
const users = require("./models/users");

const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(function(req, res, next) {
  if ("/users/login" === req.path) {
    return next();
  }
  let token = req.headers.authorization.split(" ");

  if (users.isAuth(token[0], token[1])) {
    next();
  } else {
    res.status(401).json({ message: "unauthorized" });
  }
});

app.use(express.urlencoded({ extended: true }));
app.use("/users", userRouters);
app.use("/songs", songRouters);
app.use("/playlists", playlistRouters);

app.listen(3000, () => console.log("listening to 3000..."));
