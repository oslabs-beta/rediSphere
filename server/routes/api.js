const express = require('express');
const redisController = require('../controllers/redisController');
const router = express.Router();
//Nothing on /api path
router.get('/', (req, res) => {
  return res.status(200).json('REDIS');
});
//sends cachehitratio to the front
router.get(
  '/cacheHitsRatio',
  redisController.connectUserRedis,
  redisController.getCacheHitsRatio,
  redisController.disconnectRedis,
  (req, res) => {
    return res.status(200).json(res.locals.cacheHitRatio);
  },
);
//sends evicted and expired to the front
router.get(
  '/evictedExpired',
  redisController.connectUserRedis,
  redisController.getEvictedExpired,
  redisController.disconnectRedis,
  (req, res) => {
    return res.status(200).json(res.locals.evictedExpired);
  },
);

router.get('/latency', redisController.getResponseTimes, (req, res) => {
  return res.status(200).json(res.locals.latency);
});

router.get('/memory', redisController.getMemory, (req, res) => {
  return res.status(200).json(res.locals.memory);
});

module.exports = router;
