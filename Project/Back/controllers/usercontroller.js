const users = require("../models/users");

exports.login = (req, res, next) => {
  res.status(200).json(users.login(req.body.username, req.body.password));
};

exports.logout = (req, res, next) => {
  res.status(200).json(users.logout(req.params.userId));
};
