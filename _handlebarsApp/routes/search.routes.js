const router = require("express").Router();
const mongoose = require("mongoose");
const axios = require('axios');

const URI = require("urijs");
const URITemplate = require('urijs/src/URITemplate');


const seeds = require("../seedData/events.json")
const Event = require("../models/Event.model");
const User = require("../models/User.model");



const convert = require("../helperFunctions/convertTmData");
const notLoggedIn = require("../middleware/notLoggedIn");



const apiKey = process.env.APIKEY || "dCkxNrTE0AgGoRUEfzKDYKoSkQOS2Evd";


//CREATE URI
let uriTemplate = new URITemplate(`https://app.ticketmaster.com/discovery/v2/{resource}.json{?q*,apikey}`);



//SEARCH API THEN DB THEN CONCAT RESULTS
router.get("/", notLoggedIn, (req, res) => {
    let resultsArray = [];

    //get the search input:
    const keyword = req.query.keyword;
    const citySearched = req.query.city;
    const date = req.query.date;

    let dateApi = date + "T00:00:00,*"


    //QUERY THE API:
    //create the URI for the API:
    let searchUri = uriTemplate.expand({
        resource: "events",
        q: {
            size: "50", 
            keyword, 
            city: citySearched,
            localStartDateTime: dateApi
        },
        apikey: apiKey
      })
        
    console.log("uri: ", searchUri)

    //invoke the API with the created URI, then push each event into an array:
    axios.get(searchUri)
    .then(results => {
        if (results.data._embedded && results.data._embedded.events) {
            let events = results.data._embedded.events
            let dataFromApi = events.map(convert)
            return dataFromApi;
        }
        else {
            let emptyArr = [];
            console.log("no results from API query")
            return emptyArr
        }

    }).then(resultsFromApi => {
        console.log(" >>>>>>>>> RESULTS API : ", resultsFromApi[0])
        //DB search
        const keywordString = keyword.split(" ").map(el=>`"${el}"`).join(" ");

        Event.find({ 
            $and: [
                {$text: { $search: keywordString }},
                {"location.city": citySearched},
                {"dateAndTime.date": { $gte: new Date(date) }}
            ]              
        })
        .then(resultsFromDB => {
            resultsArray = resultsFromApi.concat(resultsFromDB)
            console.log("db results: ", resultsFromDB)

            if(resultsArray || resultsArray.length > 1) {
                resultsArray.sort((a, b) => {return new Date(a.dateAndTime.date) - new Date(b.dateAndTime.date)})
            }


            if(!resultsArray || resultsArray.length === 0){res.render("search/noSearchResults", {user: req.session.user})}
            else {res.render("search/searchResults" , {results: resultsArray, user: req.session.user})}

        }).catch(err => console.log(err))
        
        console.log("test session : " , req.session.user._id)
    })
    .catch(err => console.log(err))

});




//LEFT TO DO : 
//-SORT RESULTS (BY DATE?)
//array.sort(el, el2 => el.date .localcompare el2.date)
//-CHANGE THE EVENT MODEL (OBJECTS/ARRAYS, HOW TO CREATE DOC WITH IT? AND INDEX?)
//DISPLAY RESULTS


module.exports = router;


