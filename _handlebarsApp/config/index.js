const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const favicon = require("serve-favicon");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const MONGO_URI = require("../utils/consts");
const Handlebars = require("hbs")

const mongoose = require("mongoose");

const User = require("../models/User.model");
const Event = require("../models/Event.model")



// Middleware configuration
module.exports = (app) => {
  app.use(logger("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.set("views", path.join(__dirname, "..", "views"));
  app.set("view engine", "hbs");
  app.use(express.static(path.join(__dirname, "..", "public")));





  //HBS HELPER FUNCTIONS
  Handlebars.registerHelper('isOwner', function (ownerId, userId) {
    if (typeof ownerId === 'object') {
      if (ownerId.equals(userId)) {return true} 
    } else {return false}
  });



  //UPPERCASE HELPER
  Handlebars.registerHelper('toUpperCase', function(str) {
    return str.toUpperCase();
  });

  //FIND EVENT BY ID HELPER
  /*
  Handlebars.registerHelper("findEventById", function(str) {
    Event.findById(str)
    .then((event) => {
        return event;
  })
  */

  //HBS HELPER FUNCTIONS
  Handlebars.registerHelper('isOwner', function (ownerId, userId) {
    if (typeof ownerId === 'object') {
      if (ownerId.equals(userId)) {return true} 
    } else {return false}
  });

  app.use(
    favicon(path.join(__dirname, "..", "public", "images", "favicon.ico"))
  );

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "super hyper secret key",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: MONGO_URI,
      }),
    })
  );
};
