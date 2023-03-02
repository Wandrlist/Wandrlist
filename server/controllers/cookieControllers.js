const cookieController = {};
const { User } = require("../model.js");

// set cookie confirming user is logged in
cookieController.setSSIDCookie = (req, res, next) => {
  if (res.locals.message) {
    res.cookie("ssid", res.locals._id, { httpOnly: true });
  }
  return next();
}

// verify ssid cookie
cookieController.verifySSIDCookie = (req, res, next) => {
  const { ssid } = req.cookies;
  
  User.findOne({ _id: ssid })
    .then((data) => {
      console.log(data);
      if (data !== null) {
        res.locals.loggedIn = true;
        res.locals.data = data;
        return next();
      } else {
        res.locals.loggedIn = false;
        return next();
      }
    })
    .catch((err) => {
      return next({
        log: `cookieController.verifySSIDCookie: Error: ${err}`,
        message: {
          err: "Error occured in cookieController.verifySSIDCookie, check server logs for more details",
        },
      });
    });
};

// deletes cookie when logged out
cookieController.logoutCookie = (req, res, next) => {
  res.clearCookie("ssid");
  return next();
}

module.exports = cookieController;