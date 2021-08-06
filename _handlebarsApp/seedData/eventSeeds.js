/* /const mongoose = require('mongoose')
const seedData = require("./events.json")
//const Event = require('../models/Event.model')
require('../db/index.js')


//TAKE VALUES FROM LARGER SEEDED DB AND REDUCE TO DESIRED VALUES (SMALLER SEED OBJECTS)

const eventArr = seedData._embedded.events */


//DELETE EXISTING DATA, SEED DB WITH DATA FROM ABOVE

/* Event.deleteMany()
.then(() => Event.create(seedData))
.then(newEvents => {
console.log(`Created ${newEvents.length} movies`);
mongoose.connection.close();
})
.catch(err =>
console.log(`An error occurred while getting drones from the DB: ${err}`)
); */