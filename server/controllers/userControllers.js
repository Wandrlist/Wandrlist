const { User, Itinerary, Activity } = require("../model.js");
const bcrypt = require('bcryptjs');

const userController = {};

//create a new user
userController.createUser = (req, res, next) => {
  const { email, password } = req.body;

  if (email && password) {
    User.create({ email, password })
      .then((data) => {
        res.locals._id = data._id; // _id is used for ssid
        res.locals.message = true;
        return next();
      })
      .catch((err) => {
        return next({
          log: `userController.createUser: Error: ${err}`,
          message: {
            err: "Error occured in userController.createUser, check server logs for more details",
          },
        });
      });
  } else {
    next({
      log: `userController.createUser: Username or password are invalid.`,
      message: {
        err: "Error occured in userController.createUser, Username and password are required.",
      },
    });
  }
};
//checking password during login
userController.verifyUser = (req, res, next) => {
  const { email, password } = req.body;
  
  User.findOne({ email })
    .then((data) => {
      if (data === null) {
        return next({
          log: `userController.verifyUser: email is invalid.`,
          message: {
            err: "Error occured in userController.createUser, email/password invaid.",
          },
        })
      } else if (!bcrypt.compareSync(password, data.password)) {
        return next({
          log: `userController.verifyUser: password is invalid.`,
          message: {
            err: "Error occured in userController.createUser, email/password invaid.",
          },
        })
      } else {
        res.locals._id = data._id;
        res.locals.data = data;
        res.locals.message = true;
        return next(); 
      }
    })
    .catch((err) => {
      return next({
        log: `userController.verifyUser: Error: ${err}.`,
        message: {
          err: "Error occured in userController.createUser, error creating a user.",
        },
      })
    })
};

//grabbing all user's itineraries once they log in
userController.getAllItineraries = (req, res, next) => {
  const itineraries = res.locals.data.itineraries;
  res.locals.itineraries = [];
  for (let i = 0; i < itineraries.length; i++) {
    Itinerary.find({ _id : itineraries[i] }, (err, itinerary) => {
      if (err) return next({
        log: `userController.getAllItineraries: Error: ${err}.`,
        message: {
          err: "Error occured in userController.getAllItineraries, error getting itineraries",
        },
      });
      res.locals.itineraries.push(itinerary);
    })
  }
  console.log(res.locals.itineraries);
  return next();
};


//create an itinerary
userController.createItinerary = (req, res, next) => {
  const userID = req.cookies.ssid;
  const { title, dateStart, duration, location } = req.body;
  if (title && dateStart && duration && location) {
    Itinerary.create({
      title: title,
      dateStart: dateStart,
      duration: duration,
      location: location,
    })
    .then(data => {
      res.locals.itinerary = data;
      User.findById(userID, 'itineraries')
        .then(res => {
          res.itineraries.push(data);
          User.updateOne({ _id : userID }, { itineraries : res.itineraries }).exec()
        })
      return next();
    })
    .catch((err) => {
      return next({
        log: `userController.createItinerary: Error: ${err}`,
        message: {
          err: "Error occured in userController.createItinerary, check server logs for more details",
        },
      });
    });
  } else {
    next({
      log: `userController.createItinerary: Itinerary information is missing.`,
      message: {
        err: "Error occured in userController.createItinerary, All data fields are required.",
      },
    });
  }
};

//delete an itinerary 
userController.deleteItinerary = (req, res, next) => {
  const { _id, title } = req.body;
  const userID = req.cookies.ssid;
  User.findById(userID, 'itineraries')
    .then(res => {
      const index = res.itineraries.indexOf(_id);
      res.itineraries.splice(index, 1);
      console.log(res.itineraries);
      User.updateOne({ _id : userID }, { itineraries : [...res.itineraries] }).exec();
    })
  Itinerary.deleteOne({ _id: _id })
  .then(data => {
    if (data.deletedCount === 1) {
      res.locals.message = `${title} successfully deleted!`
    } else {
      res.locals.message = `Nothing was deleted.`
    }
    return next();
  })
  .catch((err) => {
    return next({
      log: `userController.deleteItinerary: Error: ${err}`,
      message: {
        err: "Error occured in userController.deleteItinerary, check server logs for more details",
      },
    });
  });
};

//make changes to an itinerary
userController.updateItinerary = (req, res, next) => {
  
  const { _id, title, dateStart, duration, locations, activities} = req.body;
  Itinerary.updateOne({ _id: _id}, {
    title: title,
    dateStart: dateStart,
    duration: duration,
    locations: locations,
    activities: activities,
  })
  .then(data => {
    if (data.acknowledged === true) {
      res.locals.message = `${title} was updated!`
    } else {
      res.locals.message = `Nothing was updated`
    }
    return next();
  })    
  .catch((err) => {
    return next({
      log: `userController.updateItinerary: Error: ${err}`,
      message: {
        err: "Error occured in userController.updateItinerary, check server logs for more details",
      },
    });
  })  
};

module.exports = userController;