const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const eventSchema = new Schema({
	name: String,
	description: String,
	type: [String],
	tags: [String],
	location: {
        venueName: String,
        city: String,
        country: String
    },
	dateAndTime: {
        date: Date,
        time: String
    },
	urlForTickets: String,
	img: String,
	artistSiteUrl: String,
	owner: { type: Schema.Types.ObjectId, ref: "User" },
	followers: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

eventSchema.index({
	"name": "text",
	"description": "text",
	"type":"text",
	"tags": "text",
	"location.venueName": "text",
	"location.city": "text",
	"location.country": "text"
})

const Event = model("Event", eventSchema);

module.exports = Event;




/* event {
	name:""
	description:""
	type: [ ]
	tags: [ ]
	location: { }
	date: { }
	urlfortickets:
	img:
	owner: /default : TM
	extUrl:
	
}
 */