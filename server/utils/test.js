const createLoadTest = require('./redis-load-test');

const options = {
  totalClients: 5,
  totalOps: 100000,
  timeLimit: 60,
};

createLoadTest(options)
  .then(() => {
    console.log('Load test complete!');
  })
  .catch((err) => {
    console.error('Test failed', err);
  });
