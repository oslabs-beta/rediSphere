//const createLoadTest = require('./redis-load-test');

const createLoadTest = require('./update.js');

const options = {
  totalClients: 5,
  totalOps: 100000,
  timeLimit: 60,
  targets: [1, 1, 1, 1],
};

createLoadTest(options)
  .then(() => {
    console.log('Load test complete!');
  })
  .catch((err) => {
    console.error('Test failed', err);
  });
