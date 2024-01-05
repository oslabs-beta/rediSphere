//api.js

//potentially rename to apiRouter for consistency

const express = require('express');
const redisController = require('../controllers/redisController');
const router = express.Router();

// could set up the requests from the frontend to include an API key / token in the header of the request

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
