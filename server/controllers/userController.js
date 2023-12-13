const User = require('../models/userModel');

const userController = {};

//createUser - create and save a new User into the database
userController.createUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    //first check if username is already saved in database
    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) {
      return res.json('username taken');
    }

    //create new user
    const newUser = await User.create({
      username,
      password,
    });
    res.locals.message = 'ok';
    res.locals.userID = newUser.id;
    return next();
  } catch (err) {
    return next({
      log: 'createUser error',
      message: 'could not create new user',
      status: 500,
    });
  }
};

//verifyUser - when user tries to sign in
userController.verifyUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    //see if username is in database
    const userExists = await User.findOne({ username });
    if (userExists) {
      //if so, bcrypt compare password with stored hashed password
      const passwordMatch = await userExists.comparePassword(password);
      //if username and password match, good to go
      if (passwordMatch) {
        res.locals.message = 'ok';
        res.locals.userID = userExists.id;
        return next();
      }
    }
    //otherwise, login failed
    return res.json('not ok');
  } catch (err) {
    return next({
      log: 'verifyUser error',
      message: 'could not reach database to verify user',
      status: 500,
    });
  }
};

//findUser - find the username associated with ssid cookie
userController.findUser = async (req, res, next) => {
  try {
    const id = req.cookies.ssid;
    const user = await User.findById(id);
    res.locals.username = user.username;
    return next();
  } catch (err) {
    return next({
      log: 'userController findUser error',
      message: 'error occured when trying to find user',
      status: 500,
    });
  }
};

module.exports = userController;
