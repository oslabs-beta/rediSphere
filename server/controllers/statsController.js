//---this file currently not in use ----//

// const { createClient } = require('redis');

// const statsController = {};

// //create middleware for fetching stat
// //create middleware for parsing stat
// //create middleware for storing stat

// //creating a client for our user's Redis database
// const client = createClient({
//   //Jake's specific password
//   password: 'w3mIvPMZVw7cwTshUE3pdqsuBHkAdYdg',
//   socket: {
//     //jake's specific Redis Cloud host
//     host: 'redis-15161.c321.us-east-1-2.ec2.cloud.redislabs.com',
//     //public endpoin URL: redis-15161.c321.us-east-1-2.ec2.cloud.redislabs.com:15161
//     port: 15161,

//     //can add a "reconnect strategy" which fires when a connection is closed unexpectedly
//     //reconnectStrategy:
//     //false = do not reconnect, close client and flush command queue of pending commands
//     //retries = number of reattempts at connection,
//   },
// });

// //create a connection from the client to the database
// //check for the 'ready' event, and log when it fires
// client.connect().then(() => {
//   const subscriber = client.duplicate();
//   subscriber.on('ready', () => {
//     console.log(`Redis connection established on server port 15161`);
//     const startTime = Date.now();
//   });
// });
// //client.resetInfo -- is this how we would sent a command line command to reset the info being collected?

// //need clarity on how much time the info was collected over
// //assuming data is lifetime for server? session?

// statsController.getStats = async (req, res, next) => {
//   try {
//     // TODO: add a conditional to check if connection has alraedy been opened
//     //await client.connect();
//     client.set('Ryan', 'Jake');
//     client.set('Jake', 'Ryan');
//     //fetch the stats from the Redis instance
//     const stats = await client.info('stats');
//     //console.log(stats);

//     //store the stats array on the res.locals.stats object
//     res.locals.stats = stats;
//     //console.log('past storing stats');

//     //add a timestamp field on the locals.stats object
//     res.locals.stats.timestamp = new Date(Date.now());
//     //console.log('past storing timestamp');
//     //add the client start time (possibly time 0 for timer series?)
//     //res.locals.stats.clientStartTime = startTime;

//     console.log('stats', res.locals.stats, 'timestamp', res.locals.stats.timestamp);
//     return next();
//   } catch (err) {
//     return next(err);
//   }
// };

// statsController.parseStats = async (req, res, next) => {
//   try {
//     const { stats } = res.locals.stats;
//     // for charting, need value over time
//     // create a tick object to represent one 'tick' object
//   } catch (err) {
//     return next(err);
//   }
// };

// module.exports = statsController;
