const User = require('../models/userModel');

const userController = {};

//get user's widgets array
userController.getWidgets = async (req, res, next) => {
  try {
    const id = req.cookies.ssid;
    const user = await User.findById(id);
    res.locals.widgets = user.widgets;
    // console.log(user.widgets);
    return next();
  } catch (err) {
    return next({
      log: 'userController getWidgets error',
      message: 'could not get widgets',
      status: 500,
    });
  }
};

//get user's widgets array
userController.deleteWidget = async (req, res, next) => {
  const indexToDelete = parseInt(req.params.index);
  try {
    const id = req.cookies.ssid;
    const user = await User.findById(id);
    const newWidgets = user.widgets
      .slice(0, indexToDelete)
      .concat(user.widgets.slice(indexToDelete + 1));
    const update = await user.updateOne({ $set: { widgets: newWidgets } });
    res.locals.widgets = newWidgets;
    return next();
  } catch (err) {
    return next({
      log: 'userController deleteWidgets error',
      message: 'could not delete widget',
      status: 500,
    });
  }
};

//add widget to user's widgets array, sends back whole widgets array
userController.addWidget = async (req, res, next) => {
  const { newWidget } = req.body;
  try {
    const id = req.cookies.ssid;
    //new:true because default behavior (new: false)
    //is to return the user document Before it updates
    const update = await User.findByIdAndUpdate(
      id,
      { $push: { widgets: [newWidget] } },
      { new: true },
    );
    res.locals.widgets = update.widgets;
    // console.log(update.widgets);
    return next();
  } catch (err) {
    return next({
      log: 'userController add widget error',
      message: 'could not add widget',
      status: 500,
    });
  }
};

//add Redis credentials
userController.addRedisCredentials = async (req, res, next) => {
  const { host, port, redisPassword } = req.body;
  try {
    const id = req.cookies.ssid;
    const update = await User.updateOne({ _id: id }, { $set: { host, port, redisPassword } });
    res.locals.message = 'ok';
    return next();
  } catch (err) {
    return next({
      log: 'addRedisCredentials error',
      message: 'could not addRedisCredentials',
      status: 500,
    });
  }
};

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
    res.locals.username = username;
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
        res.locals.username = username;
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
