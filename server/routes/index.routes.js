const router = require("express").Router();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("../models/User.model");

const loggedIn = require("../middleware/loggedIn");


//LOGIN ROUTES

router.get("/", loggedIn, (req, res) => {
  res.render("index");
});

router.post("/", loggedIn, (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    return res
      .status(400)
      .render("index", { errorMessage: "Please provide your username." });
  }

  if (password.length < 8) {
    return res.status(400).render("index", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .render("index", { errorMessage: "Wrong credentials." });
      }

      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("index", { errorMessage: "Wrong credentials." });
        }
        req.session.user = user;
        return res.redirect("/home");
      });
    })

    .catch((err) => {
      next(err);
    });
});

module.exports = router;
