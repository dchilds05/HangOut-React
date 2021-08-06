const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    // unique: true -> Ideally, should be unique, but its up to you
  },
  password: String,
  email: String,
  city: String,
  age: Number,
  imageUrl: {
		type: String,
		default: '/images/noPhoto.png'
	},
  createdEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
	savedEvents: [Object]
});

const User = model("User", userSchema);

module.exports = User;
