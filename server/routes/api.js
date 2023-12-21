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
    return res.status(200).json(res.locals.stats);
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
//sends latency to the front
router.get(
  '/latency',
  redisController.connectUserRedis,
  redisController.getResponseTimes,
  redisController.disconnectRedis,
  (req, res) => {
    return res.status(200).json(res.locals.latency);
  },
);
//sends memory usage to the front
router.get(
  '/memory',
  redisController.connectUserRedis,
  redisController.getMemory,
  redisController.disconnectRedis,
  (req, res) => {
    return res.status(200).json(res.locals.memory);
  },
);

module.exports = router;
