const router = require("express").Router();
const axios = require("axios");

const notLoggedIn = require("../middleware/notLoggedIn");

const seedData = require("../seedData/events.json")

const User = require('./../models/User.model');
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const imageUploader = require('./../config/cloudinary')




const URI = require("urijs");
const URITemplate = require('urijs/src/URITemplate');

const convert = require("../helperFunctions/convertTmData");


const apiKey = process.env.APIKEY || "dCkxNrTE0AgGoRUEfzKDYKoSkQOS2Evd";

//CREATE URI
let uriTemplate = new URITemplate(`https://app.ticketmaster.com/discovery/v2/events.json{?city*,apikey}`);




router.get("/", notLoggedIn, (req, res) => {

  User.findById(req.session.user._id)
  .populate("createdEvents")
  .then((user) => {//NEED SORT METHOD HERE TO PUT IN ORDER BY DATE

    let upcomingEvents = user.savedEvents;

    if(upcomingEvents.length > 1) {
      upcomingEvents.sort((a, b) => {return new Date(a.dateAndTime.date) - new Date(b.dateAndTime.date)})
    }

  
    let upcomingOwnEvents = user.createdEvents;

    if(upcomingOwnEvents.length > 1) {
      upcomingOwnEvents.sort((a, b) => {return new Date(a.dateAndTime.date) - new Date(b.dateAndTime.date)})
    }

    //Search for events near you, sorted:
    
    let userCity = user.city;

    let searchUri = uriTemplate.expand({
      city: userCity,
      apikey: apiKey
    })
    console.log("search url: ", searchUri)

    axios.get(searchUri).then(results => {
      if (results.data._embedded && results.data._embedded.events) {
        let events = results.data._embedded.events
        let dataFromApi = events.map(convert)
        if(dataFromApi.length > 1) {
          dataFromApi.sort((a, b) => {
            return new Date(a.dateAndTime.date) - new Date(b.dateAndTime.date)
          })
        }
        return dataFromApi;
      }
      else {
        let emptyArr = [];
        console.log("no results from API query")
        return emptyArr
      }

    })
    .then(array => {
      res.render("home/home", {user: user, events: array});
    })
    .catch(err => console.log(err))
    
  })
})

router.get("/account", notLoggedIn, (req, res) => {
  User.findById(req.session.user._id)
  .populate("createdEvents")
  .then((user) => {
    res.render("home/accountPage", user);
  })
});

router.get("/account/edit", notLoggedIn, (req, res) => {
  res.render("home/editAccountDetails", req.session.user);
  });

router.post('/account/edit', imageUploader.single('imageUrl'), (req, res) => {

  const userId = req.session.user._id;

  Object.keys(req.body) // This returns an array of the object keys
  .forEach(key => (!req.body[key] && req.body[key] !== undefined) && delete req.body[key]);

  req.body.imageUrl = req.file.path;
  
  if(req.body.password) {
    if (req.body.password.length < 8) {
      return res.status(400).render("auth/signup", {
        errorMessage: "Your password needs to be at least 8 characters long.",
      });
    }
    return bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(req.body.password, salt))
    .then((hashedPassword) => {
      req.body.password = hashedPassword;
      User.findByIdAndUpdate(userId, req.body)
        .then((updatedUser) => {
          console.log("Updated user: " + updatedUser);
          res.redirect('/auth/logout');
        })
        .catch((error) => {
          console.log(error);
        });
    })
  } 
  else {
    User.findByIdAndUpdate(userId, req.body)
      .then((updatedUser) => {
        console.log("Updated user: " + updatedUser);
        res.redirect('/auth/logout');
      })
      .catch((error) => {
        console.log(error);
      });
  }
});


router.get("/myEvents", notLoggedIn, (req, res) => {
  res.render("home/myOwnEvents", req.session.user);
  });


router.get("/upcomingEvents", notLoggedIn, (req, res) => {
  res.render("home/myUpcomingEvents", req.session.user);
  });



module.exports = router;