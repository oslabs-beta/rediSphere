const createLoadTest = require('./redis-load-test');

//const createLoadTest = require('./update.js');

const options = {
  totalClients: 1,
  totalOps: 250,
  timeLimit: 10000,
  targets: 4,
};

createLoadTest(options)
  .then(() => {
    console.log('Load test complete!');
  })
  .catch((err) => {
    console.error('Test failed', err);
  });
