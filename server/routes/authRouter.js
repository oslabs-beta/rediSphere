const express = require('express');
const userController = require('../controllers/userController.js');
const cookieController = require('../controllers/cookieController.js');
const sessionController = require('../controllers/sessionController.js');
const router = express.Router();

// post req to sign up, once signed up, redirect to dashboard
router.post(
  '/create',
  userController.createUser,
  cookieController.setSSIDCookie,
  sessionController.startSession,
  (req, res) => res.json(res.locals.message),
);

// post req to log in, redirect to dashboard
router.post(
  '/signin',
  userController.verifyUser,
  cookieController.setSSIDCookie,
  sessionController.startSession,
  (req, res) => res.json(res.locals.message),
);

//connect redis
router.put('/connect-redis', userController.addRedisCredentials, (req, res) =>
  res.json(res.locals.message),
);

//get username
router.get('/whoami', userController.findUser, (req, res) => res.json(res.locals.username));

//get session
router.get('/session', sessionController.isLoggedIn, (req, res) => res.json(res.locals.session));

//log out
router.delete('/signout', sessionController.logOut, (req, res) => {
  return res.json(res.locals.loggedOut);
});

module.exports = router;
