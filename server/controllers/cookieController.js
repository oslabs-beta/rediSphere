const Session = require('../models/sessionModel.js');

const cookieController = {};

//setSSIDCookie - store the user id in a cookie
cookieController.setSSIDCookie = (req, res, next) => {
  const id = res.locals.userID;
  res.cookie('ssid', id, { httpOnly: true });
  return next();
};

module.exports = cookieController;
