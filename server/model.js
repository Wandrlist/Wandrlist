const mongoose = require('mongoose');

//collection for Users
const userSchema = new mongoose.Schema ({
  email: {type : String, required : true, unique : true},
  password: {type : String, rquired : true},
  itineraries: [{type : ObjectId, ref: 'Itinerary'}],
});

//collection for Itineraries
const itinerarySchema = new mongoose.Schema ({
  title: {type: String, default: 'My trip'},
  dateStart: {type: Date, required: true},
  duration: {type : number, required: true},
  locations: [{type : string}],
  activities: [{type : ObjectId, ref: 'Activity'}],
})

//collection for Activities
const curIndex = 0; //setting default index, each activity created will have a default value incremented from the previous one
const activitySchema = new mongoose.Schema ({
  title: {type: String, default: 'My activity'},
  index: {type: Number, default: curIndex++},
  date: {type: Date, required: true},
  location: {type: string, required: true},
  type: {type: string},
})

const User = mongoose.model('User', userSchema);
const Itinerary = mongoose.model('Itinerary', itinerarySchema);
const Activity = mongoose.model('Activity', activitySchema);

module.exports = {
  User,
  Itinerary,
  Activity
}