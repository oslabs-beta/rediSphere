const createLoadTest = require('./redis-load-test');

//const createLoadTest = require('./update.js');

const options = {
  totalClients: 1,
  totalOps: 1000,
  timeLimit: 100000,
  targets: 4,
};

createLoadTest(options)
  .then(() => {
    console.log('Load test complete!');
  })
  .catch((err) => {
    console.error('Test failed', err);
  });
