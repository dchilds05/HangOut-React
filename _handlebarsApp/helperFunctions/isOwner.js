const router = require("express").Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");
const Event = require("../models/Event.model")



function isOwner (event, currentUser) {

    console.log("user test: ", currentUser._id)
    Event.findById(event._id)
    .populate('owner')
    .then(eventFound => {
        let ownerId = eventFound.owner._id
        let userId = currentUser._id
        if (ownerId.equals(userId)) {
            console.log("function test success!")
            return 1
        } else {
            console.log("Nope. try again")}
            return 0
    })

}

module.exports = isOwner;