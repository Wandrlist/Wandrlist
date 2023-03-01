const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;

//collection for Users
const userSchema = new mongoose.Schema ({
  email: {type : String, required : true, unique : true},
  password: {type : String, rquired : true},
  itineraries: {type: [{type : Schema.Types.ObjectId, ref: 'Itinerary'}], default: []},
});

userSchema.pre('save', function (next) {
  const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
})

//collection for Itineraries (with activities included as an array of activities)
const itinerarySchema = new mongoose.Schema ({
  title: {type: String, default: 'My trip'},
  dateStart: {type: Date, required: true},
  duration: {type : Number, required: true},
  locations: [{type : String}],
  activities: {type: [{
    location: String,
    date: {type: Date, required: true},
  }], default: []}
});


const User = mongoose.model('User', userSchema);
const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = {
  User,
  Itinerary,
}