const express = require('express');
const redisController = require('../controllers/redisController');
const router = express.Router();

router.get('/', redisController.getCacheHitsRatio, (req, res) => {
  return res.status(200);
});

module.exports = router;
