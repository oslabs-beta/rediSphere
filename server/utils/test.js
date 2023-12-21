const createLoadTest = require('./redis-load-test');

//const createLoadTest = require('./update.js');

const options = {
  totalClients: 3,
  totalOps: 100000,
  timeLimit: 15,
  targets: 3,
};

createLoadTest(options)
  .then(() => {
    console.log('Load test complete!');
  })
  .catch((err) => {
    console.error('Test failed', err);
  });
