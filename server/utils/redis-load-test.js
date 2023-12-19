const Redis = require('redis');
const { randomBytes } = require('crypto');
require('dotenv').config();

const redisPassword = process.env.REDIS_PASS;
const socketHost = process.env.HOST;
const redisPort = process.env.REDIS_PORT;
//const redisURL = `redis://${redisUser}:${redisPassword}@${socketHost}:${redisPort}`;
//HELPER FUNCTIONS

//Creates a configured client w/error handler
function createConfiguredClient() {
  // create and configure redis client
  const client = Redis.createClient({
    password: redisPassword,
    socket: {
      host: socketHost,
      port: redisPort,
    },
  });
  //set the error listener to log out errors if they occur
  client.on('error', (err) => {
    console.error('Redis client error', err);
  });

  return client;
}

//runs a random operation:
// 50% set, 50% get
// keys/values are random hex values
function runRandomOp(client) {
  const key = generateRandomKey(totalKeys);

  if (Math.random() < 0.5) {
    //client.set(key, generateRandomValue());
    client.setEx(key, 5, generateRandomValue());
  } else {
    client.get(key, (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }
}

// Generate random string keys and values
// # of keys will pull value from createLoadTest default for number of keys
function generateRandomKey(tK = totalKeys) {
  let keyBytes = randomBytes(16);
  const decBytes = parseInt(keyBytes.toString('hex'), 16); //converts bytes to hex, then to decimal (hex is radix 16)
  const keyNum = decBytes % tK; //constrain to keyspace of size totalKeys
  keyBytes = Buffer.from(keyNum);
  return keyBytes;
}

function generateRandomValue() {
  return randomBytes(50);
}

// redis-load-test.js

module.exports = function createLoadTest({
  totalClients = 1,
  totalOps = 1000,
  timeLimit = 60,
  totalKeys = 50, // seconds
}) {
  const clients = [];

  for (let i = 0; i < totalClients; i++) {
    const client = createConfiguredClient();
    //connect client to server
    client.connect();

    client.on('ready', () => {
      clients.push(client);
    });
    client.on('error', (err) => {
      console.error(err);
    });
  }

  let opsCount = 0;

  const endTime = Date.now() + timeLimit * 1000;

  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      clients.forEach((client) => {
        runRandomOp(client);
        opsCount++;
      });
      console.log(`Simulating ${totalClients} clients`);
      if (opsCount >= totalOps || Date.now() > endTime) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
};
