const express = require('express');
const userController = require('../controllers/userController.js');
const cookieController = require('../controllers/cookieController.js');
const sessionController = require('../controllers/sessionController.js');
const router = express.Router();

//get user's widgets
router.get('/widgets', userController.getWidgets, (req, res) => res.json(res.locals.widgets));

//add widgets to user's widgets array, sends back whole widgets array
router.put('/add-widget', userController.addWidget, (req, res) => res.json(res.locals.widgets));

//delete widget at index and return rest of spliced array w/o the widget formely at index  as user's widgets array
router.delete('/delete-widget/:index', userController.deleteWidget, (req, res) =>
  res.json(res.locals.widgets),
);

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

//get session
router.get('/session', sessionController.isLoggedIn, (req, res) => res.json(res.locals));

//log out
router.delete('/signout', sessionController.logOut, (req, res) => {
  return res.json(res.locals.loggedOut);
});

module.exports = router;
