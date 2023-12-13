const express = require('express');
const { Redis, createClient } = require('redis');
//import 'express-async-errors'
//const cors = require('cors');
//const cookieSession = require('cookie-session');
require('dotenv').config();
const path = require('path');

const apiRouter = require('./routes/api.js');

//temp before creating router
const statsController = require('./controllers/statsController.js');

const PORT = 3000;
//process.env.PORT;
// const redisPassword = process.env.REDIS_PASS;
// const socketHost = process.env.HOST;
// const redisPort = 17853;

//creating a connection to redis instance
// const redisClient = Redis.createClient({
//   //redis[s]://[[username][:password]@][host][:port][/db-number]
//   //url: 'redis://alice:foobared@awesome.redis.server:6380'
//   //   password: redisPassword,
//   password: 'GJ2F0obKIJEQiCwR3ci03V6qLr8CFkJY',
//   socket: {
//     // host: socketHost,
//     host: 'redis-17853.c326.us-east-1-3.ec2.cloud.redislabs.com',
//     port: redisPort,
//   },
// });
//const redisClient = Redis.createClient();
// redisClient.connect()

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
app.use('/api', statsController.getStats, async (req, res) => {
  //get working connection to cloud Redis instance
  //try working connection to remote locally-hosted Redis instance

  //split out the connection logic to its own function

  //split out the benchmarking/load testing to its own utility

  //create a statsRouter router to handle stats pathing
  //create associated statsController
  //create middleware for fetching stat
  //create middleware for parsing stat
  //create middleware for storing stat
  //connect to redis instannce
  // await redisClient.connect();
  // //set one key to get *some* data to see the performance on
  // await redisClient.set('test', 'hello');
  // //response is a giant array of comma and newline separated values, with sections delinated by '# <SectionHeader>',
  // const stats = await redisClient.info('stats');
  //   //[
  //   '# Stats',
  //   'total_connections_received:2',
  //   'total_commands_processed:7',
  //   'instantaneous_ops_per_sec:0',
  //   'total_net_input_bytes:335',
  //   'total_net_output_bytes:4042',
  //   'instantaneous_input_kbps:0.00',
  //   'instantaneous_output_kbps:0.00',
  //   'rejected_connections:0',
  //   'sync_full:0',
  //   'sync_partial_ok:0',
  //   'sync_partial_err:0',
  //   'expired_keys:0',
  //   'expired_stale_perc:0.00',
  //   'expired_time_cap_reached_count:0',
  //   'expire_cycle_cpu_milliseconds:6',
  //   'evicted_keys:0', ******
  //   'keyspace_hits:0', *******
  //   'keyspace_misses:0', ******
  //   'pubsub_channels:0',
  //   'pubsub_patterns:0',
  //   'latest_fork_usec:0',
  //   'migrate_cached_sockets:0',
  //   'slave_expires_tracked_keys:0',
  //   'active_defrag_hits:0',
  //   'active_defrag_misses:0',
  //   'active_defrag_key_hits:0',
  //   'active_defrag_key_misses:0',
  //   'tracking_total_keys:0',
  //   'tracking_total_items:0',
  //   'tracking_total_prefixes:0',
  //   'unexpected_error_replies:0',
  //   'total_reads_processed:7',
  //   'total_writes_processed:5',
  //   'io_threaded_reads_processed:0',
  //   'io_threaded_writes_processed:0',
  //   ''
  // ]
  const hits = res.locals.stats.split('\r\n');
  console.log(hits);
  return res.status(200);
});

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'index.html'));
// });

// catch-all route handler for any requests to an unknown route
app.use((req, res) => res.status(404).send("This is not the page you're looking for..."));

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
