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

//collection for Itineraries
const itinerarySchema = new mongoose.Schema ({
  title: {type: String, default: 'My trip'},
  dateStart: {type: Date, required: true},
  duration: {type : Number, required: true},
  locations: [{type : String}],
  activities: {type: [{type : Schema.Types.ObjectId, ref: 'Activity'}], default: []}
});

//collection for Activities
const activitySchema = new mongoose.Schema ({
  title: {type: String, default: 'My activity'},
  date: {type: Date, required: true},
  location: {type: String, required: true},
  type: {type: String},
});

const User = mongoose.model('User', userSchema);
const Itinerary = mongoose.model('Itinerary', itinerarySchema);
const Activity = mongoose.model('Activity', activitySchema);

module.exports = {
  User,
  Itinerary,
  Activity
}