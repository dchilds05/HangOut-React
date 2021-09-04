const router = require("express").Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");
const imageUploader = require('./../config/cloudinary')
const notLoggedIn = require("../middleware/notLoggedIn");


//LOGIN IS IN INDEX.ROUTES.JS

//SIGNUP ROUTES

router.post("/signup", imageUploader.single('imageUrl'), (req, res) => {
  
  const { username, password, email, city, age, imageUrl, createdEvents, savedEvents } = req.body;

  if (password.length < 8) {
    res.status(400).json({message: "Your password needs to be at least 8 characters long."})
  }
  
  User.findOne({ username }).then((found) => {
    if (found) {
      res.status(402).json({ message: "Username already taken." });
    }
    else{

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
  
         User.create({ 
          username: req.body.username, 
          password: hashedPassword,
          email: req.body.email, 
          city: req.body.city,
          age: req.body.age,
          imageUrl: req.file.path,
          createdEvents: req.body.createdEvents,
          savedEvents: req.body.savedEvents,
        })
        .then( newUser => res.json(newUser))
			  .catch(err=>res.json(err))
    }
  });
})



//LOGOUT ROUTE

router.get("/logout", notLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(400).json({ message: 'Logout failed' });
    }
    else {
			res.json({message: 'User successfully logged out'});
		}
  });
})

module.exports = router;
