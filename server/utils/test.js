const createLoadTest = require('./redis-load-test');

//const createLoadTest = require('./update.js');

const options = {
  totalClients: 1,
<<<<<<< HEAD
  totalOps: 250,
  timeLimit: 10000,
  targets: 4,
=======
  totalOps: 100000,
  timeLimit: 30,
  targets: 3,
>>>>>>> de0bf9a6c4962e003a1ea314fbc1977cce7e684c
};

createLoadTest(options)
  .then(() => {
    console.log('Load test complete!');
  })
  .catch((err) => {
    console.error('Test failed', err);
  });
