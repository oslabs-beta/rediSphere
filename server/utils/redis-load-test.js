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
// function runRandomOp(client) {
//   const key = generateRandomKey(totalKeys);
//   console.log(key);

//   if (Math.random() < 0.5) {
//     //client.set(key, generateRandomValue());
//     let val = generateRandomValue();
//     //console.log(val);
//     client.set(key, val);
//   } else {
//     client.get(key, (err, res) => {
//       if (err) {
//         console.error(err);
//         return;
//       }
//     });
//   }
// }

//const usedKeys = new Set();

function runHitOp(client) {
  //const key = [...usedKeys][Math.floor(Math.random() * usedKeys.size)];
  client.set('hit_key', generateRandomValue());
  //client.setEx('hit_key', 10, 'value');
  client.get('hit_key', (err, res) => {
    if (err) {
      console.error(err);
      return;
    } else {
      console.log('Value: ', res);
    }
  });
}

//guaranteed cache miss -- never set a key other than 'hit_key'
function runMissOp(client, totalKeys) {
  client.get(generateRandomKey(1000000));
}

//random key generator
function generateRandomKey(totalKeys) {
  return Math.floor(Math.random() * totalKeys).toString();
}

//random value generator
function generateRandomValue(sizeInBytes = 50) {
  //MB = 1000 KB
  //KB = 1000 Bytes
  return randomBytes(sizeInBytes);
}

function setWindows(periods, startTime, timeLimit) {
  const windowSize = Math.floor((timeLimit * 1000) / periods);

  const windows = [];
  let start = startTime;
  let end = start + windowSize;

  for (let i = 0; i < periods; i++) {
    windows.push({ start, end });
    start = end + 1;
    end += windowSize;
  }

  return windows;
  //returns [{start: 1700894, end: 1800894}, {start: ... , end: ...}]
}
function runCacheFill(client) {
  //while memory used < 30MB
  //set more keys

  for (let i = 1; i < 50; i++) {
    client.setEx(`${i}`, 15, generateRandomValue(1000000));
  }
}

function getLeastRecentKey(client) {
  for (let i = 0; i < 26; i++) {
    client.get(`${i}`, generateRandomValue());
  }
}

// function getCurrentWindow(windows, now) {
//   for (let i = 0; i < windows.length; i++) {
//     const window = windows[i];
//     if (now >= window.start && now <= window.end) return i;
//   }
// }

module.exports = function createLoadTest({
  totalClients = 5,
  totalOps = 1000,
  timeLimit = 15, // seconds
  totalKeys = 1000000,
  targets = 3,
}) {
  const clients = [];

  for (let i = 0; i < totalClients; i++) {
    const client = createConfiguredClient();
    //connect client to server
    client.connect();

    client.on('ready', () => {
      clients.push(client);
      console.log(clients);
    });
    client.on('error', (err) => {
      console.error(err);
    });
  }
  //console.log(clients);

  let opsCount = 0;

  const startTime = Date.now();
  const endTime = Date.now() + timeLimit * 1000;
  const windows = setWindows(targets, startTime, timeLimit);
  console.log(windows);
  let window = 0;

  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      now = Date.now();

      //const currWindow = getCurrentWindow(windows, startTime, now);

      console.log('Current Stage: ', window);

      const isEven = window % 2 === 0;

      const opFn = isEven ? runHitOp : runHitOp;

      clients.forEach((c) => {
        switch (window) {
          case 0:
            runCacheFill(c);
            console.log('cacheFill');
            break;
          case 1:
            runHitOp(c);
            console.log('hitOp');
            break;
          case 2:
            runMissOp(c, 100);
            console.log('missOp');
            break;
        }

        // for (let i = 0; i < 10; i++) {
        //   getLeastRecentKey(c);
        // }
        //c.set('103', generateRandomValue());
        //await c.connect();

        //runCacheFill(c); //set keys is async --> if it isn't complete, still goes to check the totalOps and endTime
        //opFn(c, totalKeys);
        //runRandomOp(c);
        // c.disconnect();
        opsCount++;
      });

      console.log(`Simulating ${totalClients} clients`);
      if (opsCount >= totalOps || Date.now() > endTime) {
        clearInterval(interval);
        clients.forEach((c) => {
          try {
            c.disconnect().then(console.log('disconnected!'));
          } catch (err) {
            console.error(err);
          }
        });
        resolve();
      }
      if (windows[window].end < now) window++;
    }, 50);
  });
};
