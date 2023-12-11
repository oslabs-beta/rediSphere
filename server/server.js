const express = require('express');
//import 'express-async-errors'
//const cors = require('cors');
//const cookieSession = require('cookie-session');
require('dotenv').config();
const path = require('path');

const apiRouter = require('./routes/api.js');
const PORT = process.env.PORT;

const app = express();

// Body parser middleware for JSON data
app.use(express.json());

// Body parser middleware for URL-encoded data
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
  // statically serve everything in the build folder on the route '/build'
  app.use('/build', express.static(path.join(__dirname, '../build')));
  // serve index.html on the route '/'
  app.get('/', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../index.html'));
  });
}

// app.use('/api', apiRouter);

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'index.html'));
// });

// catch-all route handler for any requests to an unknown route
app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

//express error handler (middleware)
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

/**
 * start server
 */
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

module.exports = app;
