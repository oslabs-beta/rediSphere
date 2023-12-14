const Session = require('../models/sessionModel.js');
const sessionController = {};

// isLoggedIn - find the appropriate session for this request in the database, then verify whether or not the session is still valid.
sessionController.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.ssid) {
      const sessionExists = await Session.findOne({
        cookieId: req.cookies.ssid,
      });
      if (sessionExists) {
        res.locals.session = true;
        return next();
      }
    }
    res.locals.session = false;
    return next();
  } catch (err) {
    return next({
      log: 'sessionController isLoggedIn error',
      message: 'could not verify session',
      status: 500,
    });
  }
};

//startSession - create and save a new Session into the database.
sessionController.startSession = async (req, res, next) => {
  const id = res.locals.userID;
  try {
    const session = await Session.create({ cookieId: id });
    return next();
  } catch (err) {
    return next({
      log: 'Create session error',
      message: 'could not create new session',
      status: 500,
    });
  }
};

//log out - delete ssid cookie and delete session from session database.
sessionController.logOut = async (req, res, next) => {
  try {
    const ssid = req.cookies.ssid;
    await Session.findOneAndDelete({ cookieId: ssid });
    res.clearCookie('ssid');
    res.locals.loggedOut = true;
    return next();
  } catch (err) {
    return next({
      log: 'Express error handler caught error in sessionController.logOut middleware',
      status: 300,
      message: { err: 'Encountered error in logout process' },
    });
  }
};

module.exports = sessionController;
