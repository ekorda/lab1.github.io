window.addEventListener("load", function() {
  hideSong();
  if (sessionStorage.getItem("usersession")) {
    afterAuth();
    getSong();
    getPlayListSong();
  } else {
    beforeAuth();
  }
});
var songs = [];
class User {
  constructor(id, username, password, token) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.token = token;
  }
}

async function login() {
  document.getElementById("error-message").innerText = "";

  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  if (username.trim() != "" && password.trim() != "") {
    let res = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    }).then(res => res.json());
    console.log(res);

    if (res.message) {
      document.getElementById("error-message").innerText = res.message;
    } else {
      sessionStorage.setItem("usersession", res.token);
      sessionStorage.setItem("userId", res.userId);
      getSong();
      getPlayListSong();
      afterAuth();
    }
  }
}

async function getSong() {
  document.getElementById("error-message").innerText = "";

  songs = await fetch("http://localhost:3000/songs", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization:
        sessionStorage.getItem("userId") +
        " " +
        sessionStorage.getItem("usersession")
    }
  }).then(res => res.json());

  for (let song of songs) {
    addRowToSongTable(song.id, song.titleSong, song.releaseDateSong);
  }
}
async function addSongToPlaylist(songId) {
  await fetch(
    "http://localhost:3000/playlists/" +
      songId +
      "/users/" +
      sessionStorage.getItem("userId"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization:
          sessionStorage.getItem("userId") +
          " " +
          sessionStorage.getItem("usersession")
      }
    }
  ).then(res => {
    getPlayListSong();
    return res.json();
  });
}

async function deleteSongToPlaylist(songId) {
  await fetch(
    "http://localhost:3000/playlists/" +
      songId +
      "/users/" +
      sessionStorage.getItem("userId"),
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization:
          sessionStorage.getItem("userId") +
          " " +
          sessionStorage.getItem("usersession")
      }
    }
  ).then(res => {
    getPlayListSong();
    return res.json();
  });
}
async function getPlayListSong() {
  let playlistSongs = await fetch(
    "http://localhost:3000/playlists/users/" + sessionStorage.getItem("userId"),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization:
          sessionStorage.getItem("userId") +
          " " +
          sessionStorage.getItem("usersession")
      }
    }
  ).then(res => res.json());

  var ptb = document.getElementById("playListTable");

  while (ptb.rows.length > 1) {
    ptb.deleteRow(1);
  }

  /*if (playlistSongs.length === 0) {
    document.getElementById("playlistEmpty").style.display = "block";
  } else {
    document.getElementById("playlistEmpty").style.display = "none";
  }*/

  for (let song of playlistSongs) {
    addRowToPlaylist(song.id, song.titleSong);
  }
}

function addRowToSongTable(id, title, date) {
  var table = document.getElementById("songTable");

  var rowCount = table.rows.length;
  var row = table.insertRow(rowCount);

  row.insertCell(0).innerHTML = id;
  row.insertCell(1).innerHTML = title;
  row.insertCell(2).innerHTML = date;
  row.insertCell(3).innerHTML =
    '<button onclick="addSongToPlaylist(' +
    id +
    ')" style="width: 70px" >+</button>';
}

function addRowToPlaylist(id, title) {
  var table = document.getElementById("playListTable");

  var rowCount = table.rows.length;
  var row = table.insertRow(rowCount);

  row.insertCell(0).innerHTML = id;
  row.insertCell(1).innerHTML = title;
  row.insertCell(2).innerHTML =
    '<button onclick="deleteSongToPlaylist(' +
    id +
    ')" style="width: 70px ;margin-right:50px" > - </button> <button onclick="playSong(' +
    id +
    ')" style="width: 70px" > > </button>';
}

async function logout() {
  await fetch(
    "http://localhost:3000/users/logout/" + sessionStorage.getItem("userId"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization:
          sessionStorage.getItem("userId") +
          " " +
          sessionStorage.getItem("usersession")
      }
    }
  ).then(res => {
    sessionStorage.removeItem("usersession");
    sessionStorage.removeItem("userId");
    beforeAuth();
    reset();
    return res.json();
  });
}

function reset() {
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  var tb = document.getElementById("songTable");

  while (tb.rows.length > 1) {
    tb.deleteRow(1);
  }
  var ptb = document.getElementById("playListTable");

  while (ptb.rows.length > 1) {
    ptb.deleteRow(1);
  }
}

function onSearch() {
  let value = document.getElementById("songKey").value;

  let songss = [...songs].filter(s =>
    s.titleSong.toLowerCase().includes(value.toLowerCase())
  );

  var tb = document.getElementById("songTable");

  while (tb.rows.length > 1) {
    tb.deleteRow(1);
  }

  for (let song of songss) {
    addRowToSongTable(song.id, song.titleSong, song.releaseDateSong);
  }
}

function beforeAuth() {
  document.getElementById("afterAuth").style.display = "none";

  document.getElementById("input-credentials-after-auth").style.display =
    "none";

  document.getElementById("beforeAuth").style.display = "block";
  document.getElementById("input-credentials-before-auth").style.display =
    "block";
}

function afterAuth() {
  document.getElementById("afterAuth").style.display = "block";
  document.getElementById("input-credentials-after-auth").style.display =
    "block";

  document.getElementById("beforeAuth").style.display = "none";
  document.getElementById("input-credentials-before-auth").style.display =
    "none";
}

function hideSong() {
  document.getElementById("audioDiv").style.display = "none";
  document.getElementById("audio").src = "";
}
function playSong(id) {
  document.getElementById("audioDiv").style.display = "block";
  let song = songs.filter(s => s.id == id)[0];
  document.getElementById("musicTitle").innerText = song.titleSong;
  document.getElementById("audio").src = song.link;
}

function playRandom() {
  let i = Math.floor(Math.random() * songs.length);

  document.getElementById("audioDiv").style.display = "block";
  let song = songs[i];
  document.getElementById("musicTitle").innerText = song.titleSong;

  document.getElementById("audio").src = song.link;
}
