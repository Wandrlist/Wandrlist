const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cookieController = require('./controllers/cookieControllers');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
const userController = require('./controllers/userControllers');
const mongo_URI = require('../.env');

//connect to MongoDB
  mongoose.set("strictQuery", false);
  mongoose.connect(mongo_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('connected to database'))
  .catch((err) => console.log('error in database connection: ', err))

//parse JSON from incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// deal with cors headers
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});

//serve static files (css and html)
app.use(express.static(path.resolve(__dirname, "../client")));
// statically serve everything in the build folder on the route '/dist'
app.use('/', express.static(path.join(__dirname, '../dist')));


// route handlers
  // routes for user
app.post('/signup', userController.createUser, cookieController.setSSIDCookie, (req, res) => {
  res.status(200).json(res.locals.message);
});

app.get('/login',  cookieController.verifySSIDCookie, userController.getAllItineraries, (req, res) => {
  res.status(200).json(res.locals.itineraries);
});

app.post('/login',  userController.verifyUser, cookieController.setSSIDCookie, userController.getAllItineraries, (req, res) => {
  res.status(200).json(res.locals.itineraries);
});

app.get("/logout", cookieController.logoutCookie, (req, res) => {
  return res.sendStatus(200);
});

  // routes for itinerary
app.post("/itinerary", userController.createItinerary, (req, res) => {
  return res.status(200).json(res.locals.itinerary);
});

app.patch("/itinerary", userController.updateItinerary, (req, res) => {
  return res.status(200).json(res.locals.message);
});

app.delete("/itinerary", userController.deleteItinerary, (req, res) => {
  return res.status(200).json(res.locals.message);
});

//catch all 404 handler
app.get("*", (req, res) => {
  res.status(404).send("Page not found");
});

//Global error handling middleware
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middlware error",
    status: 500,
    message: { err: "Error occured, global error handling" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

module.exports = app;
