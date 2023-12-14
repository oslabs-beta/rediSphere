const express = require('express');
const redisController = require('../controllers/redisController');
const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).json('REDIS');
});

router.get('/cacheHitsRatio', redisController.getCacheHitsRatio, (req, res) => {
  return res.status(200).json(res.locals.cacheHitRatio);
});

router.get('/evictedExpired', redisController.getEvictedExpired, (req, res) => {
  return res.status(200).json(res.locals.evictedExpired);
});

module.exports = router;
