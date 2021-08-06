const router = require("express").Router();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const saltRounds = 10;

const User = require("../models/User.model");
const imageUploader = require('./../config/cloudinary')

const loggedIn = require("../middleware/loggedIn");
const notLoggedIn = require("../middleware/notLoggedIn");


//LOGIN IS IN INDEX.ROUTES.JS

//SIGNUP ROUTES

router.get("/signup", loggedIn, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", imageUploader.single('imageUrl'), (req, res) => {
  
  const { username, password, email, city, age, imageUrl, createdEvents, savedEvents } = req.body;

  if (password.length < 8) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  User.findOne({ username }).then((found) => {
    if (found) {
      return res
        .status(400)
        .render("auth.signup", { errorMessage: "Username already taken." });
    }

    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
  
        return User.create({ 
          username: req.body.username, 
          password: hashedPassword,
          email: req.body.email, 
          city: req.body.city,
          age: req.body.age,
          imageUrl: req.file.path,
          createdEvents: req.body.createdEvents,
          savedEvents: req.body.savedEvents,
        } );
      })
      .then((user) => {
        req.session.user = user;
        res.redirect("/home");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).render("auth/signup", {
            errorMessage:
              "Username need to be unique. The username you chose is already in use.",
          });
        }
        return res
          .status(500)
          .render("auth/signup", { errorMessage: error.message });
      });
  });
});




//LOGOUT ROUTE

router.get("/logout", notLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("/", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});

module.exports = router;
