const { createClient } = require('redis');
const User = require('../models/userModel');
const redisController = {};

//connect to user's redis instance stored in user database
redisController.connectUserRedis = async (req, res, next) => {
  try {
    const userID = req.cookies.ssid;
    const user = await User.findById(userID);
    const { host, port, redisPassword } = user;
    const redisClient = createClient({
      password: redisPassword,
      socket: {
        host,
        port,
      },
    });
    await redisClient.connect();
    req.redisClient = redisClient;
    return next();
  } catch (err) {
    return next({
      log: `redisController.connectUserRedis error: ${err}`,
      message: 'could not connect to user Redis instance',
      status: 500,
    });
  }
};

//close redis connection
//prevent ERR max number of clients reached
redisController.disconnectRedis = async (req, res, next) => {
  try {
    await req.redisClient.disconnect();
    return next();
  } catch (err) {
    return next({
      log: `redisController.disconnectRedis error: ${err}`,
      message: 'could not disconnect Redis client',
      status: 500,
    });
  }
};

//efficiency of cache usage metric
redisController.getCacheHitsRatio = async (req, res, next) => {
  try {
    const redisClient = req.redisClient;
    const stats = await redisClient.info();
    const metrics = stats.split('\r\n');
    let cacheHits = metrics.find((str) => str.startsWith('keyspace_hits'));
    let cacheMisses = metrics.find((str) => str.startsWith('keyspace_misses'));
    let timestamp = metrics.find((str) => str.startsWith('server_time_usec'));
    cacheHits = Number(cacheHits.slice(cacheHits.indexOf(':') + 1));
    cacheMisses = Number(cacheMisses.slice(cacheMisses.indexOf(':') + 1));
    timestamp = Number(timestamp.slice(timestamp.indexOf(':') + 1));
    res.locals.stats = {
      cacheHitRatio: cacheHits + cacheMisses === 0 ? 0 : cacheHits / (cacheHits + cacheMisses),
      timestamp: timestamp,
    };
    return next();
  } catch (err) {
    return next({
      log: `redisController.getCacheHitsRatio error: ${err}`,
      message: 'Get cache hits middleware error',
      status: 500,
    });
  }
};

//A persistent positive value of this metric is an indication that you need to scale the memory up.
//A positive metric value shows that your expired data is being cleaned up properly
redisController.getEvictedExpired = async (req, res, next) => {
  try {
    const redisClient = req.redisClient;
    const stats = await redisClient.info();
    const metrics = stats.split('\r\n');
    let totalKeys = metrics.find((str) => str.startsWith('db'));
    let evicted = metrics.find((str) => str.startsWith('evicted_keys'));
    let expired = metrics.find((str) => str.startsWith('expired_keys'));
    let timestamp = metrics.find((str) => str.startsWith('server_time_usec'));
    if (totalKeys)
      totalKeys = Number(totalKeys.slice(totalKeys.indexOf('=') + 1, totalKeys.indexOf(',')));
    if (evicted) evicted = Number(evicted.slice(evicted.indexOf(':') + 1));
    if (expired) expired = Number(expired.slice(expired.indexOf(':') + 1));
    if (timestamp) timestamp = Number(timestamp.slice(timestamp.indexOf(':') + 1));
    res.locals.evictedExpired = {
      totalKeys: totalKeys,
      evicted: evicted,
      expired: expired,
      timestamp: timestamp,
    };
    return next();
  } catch (err) {
    return next({
      log: `redisController.getEvictedExpired error: ${err}`,
      message: 'Get Evicted/Expired middleware error',
      status: 500,
    });
  }
};

redisController.getResponseTimes = async (req, res, next) => {
  try {
    const redisClient = req.redisClient;
    const stats = await redisClient.info();
    const metrics = stats.split('\r\n');
    let timestamp = metrics.find((str) => str.startsWith('server_time_usec'));
    let commandsProcessed = metrics.find((str) => str.startsWith('total_commands_processed'));
    commandsProcessed = Number(commandsProcessed.slice(commandsProcessed.indexOf(':') + 1));
    timestamp = Number(timestamp.slice(timestamp.indexOf(':') + 1));
    const cmdstats = await redisClient.info('commandstats');
    const cmdmetrics = cmdstats.split('\r\n');
    let avgGetCacheTime = cmdmetrics.find((str) => str.startsWith('cmdstat_get'));
    let totalGet = avgGetCacheTime;
    avgGetCacheTime = Number(avgGetCacheTime.slice(avgGetCacheTime.indexOf('usec_per_call=') + 14));
    totalGet = Number(totalGet.slice(totalGet.indexOf('calls=') + 6, totalGet.indexOf(',')));
    res.locals.latency = {
      commandsProcessed: commandsProcessed,
      totalGet: totalGet,
      avgGetCacheTime: avgGetCacheTime,
      timestamp: timestamp,
    };
    return next();
  } catch (err) {
    return next({
      log: `redisController.getResponseTimes error: ${err}`,
      message: 'Get latency middleware error',
      status: 500,
    });
  }
};

//memory usage
redisController.getMemory = async (req, res, next) => {
  try {
    const redisClient = req.redisClient;
    const stats = await redisClient.info('memory');
    const metrics = stats.split('\r\n');
    let usedMemory = metrics.find((str) => str.startsWith('used_memory_human'));
    let peakUsedMemory = metrics.find((str) => str.startsWith('used_memory_peak_human'));
    let totalMemory = metrics.find((str) => str.startsWith('total_system_memory_human'));
    usedMemory = Number(usedMemory.slice(usedMemory.indexOf(':') + 1, usedMemory.length - 1));
    peakUsedMemory = Number(
      peakUsedMemory.slice(peakUsedMemory.indexOf(':') + 1, peakUsedMemory.length - 1),
    );
    res.locals.memory = {
      usedMemory: usedMemory,
      peakUsedMemory: peakUsedMemory,
    };
    return next();
  } catch (err) {
    return next({
      log: `redisController.getMemory error: ${err}`,
      message: 'Get Memory usage middleware error',
      status: 500,
    });
  }
};

module.exports = redisController;
