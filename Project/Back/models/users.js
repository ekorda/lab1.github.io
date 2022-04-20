const songs = require("../models/songs");
const users = [
  {
    id: "1",
    username: "mehdi",
    password: "123",
    playlist: ["1"]
  },
  {
    id: "2",
    username: "youssef",
    password: "1234",
    playlist: ["2"]
  }
];
module.exports = class user {
  constructor(id, username, password, token) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.token = token;
  }
  static login(username, password) {
    const index = users.findIndex(u => u.username == username);
    if (index < 0) {
      return { message: "error :  username or password incorrect" };
    } else {
      let user = users[index];
      if (user.password === password) {
        user.token = user.username.concat(Date.now());
        return { userId: user.id, token: user.token };
      } else {
        return { message: "username or password incorrect" };
      }
    }
  }

  static getPlayListSong(userId) {
    return songs
      .getSongs()
      .filter(s => users.find(s => s.id == userId).playlist.includes(s.id));
  }

  static addSongToPlaylist(userId, id) {
    users.find(s => s.id == userId).playlist.push(id);
  }

  static deleteSongToPlaylist(userId, id) {
    users.find(s => s.id == userId).playlist.pop(id);
  }
  static isAuth(userId, token) {
    let user = users.find(s => s.id == userId);
    if (user) {
      return user.token === token;
    } else {
      return false;
    }
  }

  static logout(userId) {
    let user = users.find(s => s.id == userId);
    user.token = "";
  }
};
