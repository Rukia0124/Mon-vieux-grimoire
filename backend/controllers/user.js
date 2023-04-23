const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../services/user.service");

exports.signup = (req, res, next) => {
  const userPassword = req.body.password;
  const userEmail = req.body.email;
  userService
    .signup(userPassword, userEmail)
    .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.login = (req, res, next) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const password = req.body.password;
  userService
    .login(userPassword, userEmail, password)
    .then((user) => {
      res.status(200).json({
        userId: user._id,
        token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
          expiresIn: "24h",
        }),
      });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};
