// // const Redis = require('redis');
// // const { randomBytes } = require('crypto');
// require('dotenv').config();
// const redis = require('redis');
// const { promisify } = require('util');

// const redisPassword = process.env.REDIS_PASS;
// const socketHost = process.env.HOST;
// const redisPort = process.env.REDIS_PORT;
// //const redisURL = `redis://${redisUser}:${redisPassword}@${socketHost}:${redisPort}`;
// //HELPER FUNCTIONS

// // //Creates a configured client w/error handler
// function createConfiguredClient() {
//   // create and configure redis client
//   const client = redis.createClient({
//     password: redisPassword,
//     socket: {
//       host: socketHost,
//       port: redisPort,
//     },
//   });
//   //set the error listener to log out errors if they occur
//   client.on('error', (err) => {
//     console.error('Redis client error', err);
//   });

//   return client;
// }

// // function runHitOp(client) {
// //   const key = generateRandomKey();
// //   client.setEx(key, Math.floor((targetTimes[i + 1] - currTime) / 1000), generateRandomValue());
// //   client.get(key, (err, res) => {
// //     if (err) {
// //       console.error(err);
// //       return;
// //     }
// //   });
// // }
// // function runMissOp(client) {
// //   const key = generateRandomKey();
// //   client.get(key, (err, res) => {
// //     if (err) {
// //       console.error(err);
// //       return;
// //     }
// //   });
// // }

// // //runs a random operation:
// // // 50% set, 50% get
// // // keys/values are random hex values
// // function runRandomOp(client, split) {
// //   const key = generateRandomKey();
// //   if (Math.random() < split) {
// //     //client.set(key, generateRandomValue());
// //     client.setEx(key, 5, generateRandomValue());
// //   } else {
// //     client.get(key, (err, res) => {
// //       if (err) {
// //         console.error(err);
// //         return;
// //       }
// //     });
// //   }
// // }

// // // Generate random string keys and values
// // //const totalKeys = 50;
// // function generateRandomKey(tK = totalKeys) {
// //   return Math.floor(Math.random() * tK);
// // }

// // function generateRandomValue() {
// //   return randomBytes(50);
// // }

// // // redis-load-test.js
// // /**
// //  * @module createLoadTest
// //  * @param {number} totalClients total number of clients to initiate (not to exceed 30 for free Redis Cloud)
// //  * @param {number} totalOps total number of requests to ping the Redis instance with during test run
// //  * @param {number} timeLimit total time the run should take,in seconds
// //  * @param {number} totalKeys total number of keys to use in run
// //  * @param {Array} targets array of target cache hit ratios as percents, eg, [30, 70, 50]
// //  * @returns
// //  */

// // module.exports = function createLoadTest({
// //   totalClients = 1,
// //   totalOps = 1000,
// //   timeLimit = 60, // seconds
// //   totalKeys = 50,
// //   targets = [],
// // }) {
// //   const clients = [];

// //   for (let i = 0; i <= totalClients; i++) {
// //     const client = createConfiguredClient();
// //     //connect client to server
// //     client.connect();

// //     client.on('ready', () => {
// //       clients.push(client);
// //     });
// //     client.on('error', (err) => {
// //       console.error(err);
// //     });
// //   }

// //   const startTime = Date.now();
// //   const endTime = Date.now() + timeLimit * 1000;
// //   interval = Math.floor(startTime - endTime / (targets.length - 1));
// //   //console.log(interval); //duration of each window

// //   targetTimes = [];
// //   targets.forEach((_, i) => {
// //     targetTimes.push(startTime + i * interval);
// //   });
// //   //console.log(targetTimes);

// //   let hitCount = 0;
// //   let missCount = 0;

// //   return new Promise((resolve, reject) => {
// //     const interval = setInterval(() => {
// //       //break run into targets.length windows, evenly split
// //       for (let i = 0; i < targets.length; i++) {
// //         let currTime = Date.now();
// //         while (currTime < targetTimes[i]) {
// //           clients.forEach((client) => {
// //             if (i % 2) {
// //               runHitOp(client);
// //               hitCount++;
// //             } else {
// //               runMissOp(client);
// //               missCount++;
// //             }
// //           });
// //           currTime = Date.now();
// //         }
// //       }
// //       console.log(`Simulating ${totalClients} clients`);
// //       if (hitCount + missCount >= totalOps || Date.now() > endTime) {
// //         clearInterval(interval);
// //         console.log(`Generated ${hitCount} hits and ${missCount} misses.`);
// //         resolve();
// //       }
// //     }, 100);
// //   });
// // };

// // const Redis = require('redis');
// // const { randomBytes } = require('crypto');

// // // Helper functions

// // function createClient() {
// //   // Create and configure redis client
// //   const client = Redis.createClient({
// //     host: process.env.REDIS_HOST,
// //     port: process.env.REDIS_PORT,
// //     password: process.env.REDIS_PASSWORD,
// //   });

// //   client.on('error', handleError);

// //   return client;
// // }

// // function handleError(err) {
// //   console.error(err);
// // }

// // function generateRandomKey(total) {
// //   return Math.floor(Math.random() * total).toString();
// // }

// // function generateRandomValue() {
// //   return randomBytes(50);
// // }

// // function runOp(client) {
// //   const key = generateRandomKey(50);

// //   if (Math.random() < 0.5) {
// //     const value = generateRandomValue();
// //     client.set(key, value, handleError);
// //   } else {
// //     client.get(key, handleError);
// //   }
// // }

// // // Load test module

// // module.exports = function createLoadTest(options) {
// //   const { totalClients = 5, totalOps = 1000, timeLimit = 60 } = options;

// //   const clients = [];

// //   for (let i = 0; i < totalClients; i++) {
// //     const client = createClient();
// //     clients.push(client);

// //     client.on('ready', () => {
// //       console.log('Client connected!');
// //     });
// //   }

// //   let opsCount = 0;
// //   const endTime = Date.now() + timeLimit * 1000;

// //   return new Promise((resolve, reject) => {
// //     const interval = setInterval(() => {
// //       clients.forEach((client) => {
// //         runOp(client);
// //         opsCount++;
// //       });

// //       if (opsCount >= totalOps || Date.now() > endTime) {
// //         clearInterval(interval);

// //         clients.forEach((client) => client.quit());
// //         resolve();
// //       }
// //     }, 100);
// //   });
// // };
// // cache-test.js
