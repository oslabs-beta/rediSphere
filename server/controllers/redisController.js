const { createClient } = require('redis');
const User = require('../models/userModel');
const redisController = {};

//close redis connection
//prevent ERR max number of clients reached
redisController.disconnectRedis = async (req, res, next) => {
  try {
    req.redisClient.disconnect();
    console.log('Redis disconnected!');
    return next();
  } catch (err) {
    return next({
      log: `redisController.disconnectRedis error: ${err}`,
      message: 'could not disconnect Redis client',
      status: 500,
    });
  }
};

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
    redisClient.connect();
    console.log(`Connected to Redis Server: ${host} on port ${port}`);
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

//efficiency of cache usage metric
redisController.getCacheHitsRatio = async (req, res, next) => {
  try {
    //store Redis client from middleware
    const redisClient = req.redisClient;
    //connect to local redis instannce
    // await redisClient.connect();
    // //set one key to get *some* data to see the performance on
    // await redisClient.set('test', 'hello');
    //response is a giant array of comma and newline separated values, with sections delinated by '# <SectionHeader>',
    const stats = await redisClient.info();
    //separate string into individual metrics and store in array
    const metrics = stats.split('\r\n');

    let cacheHits = metrics.find((str) => str.startsWith('keyspace_hits'));
    let cacheMisses = metrics.find((str) => str.startsWith('keyspace_misses'));
    let timestamp = metrics.find((str) => str.startsWith('server_time_usec'));

    cacheHits = Number(cacheHits.slice(cacheHits.indexOf(':') + 1));
    cacheMisses = Number(cacheMisses.slice(cacheMisses.indexOf(':') + 1));
    timestamp = Number(timestamp.slice(timestamp.indexOf(':') + 1));

    // console.log('hits', cacheHits);
    // console.log('misses', cacheMisses);
    // console.log('timestamp in microseconds since unix epoch', timestamp);

    //if ratio lower than -0.8,  then a significant amount of the requested keys are evicted, expired, or do not exist at all

    res.locals.stats = {
      cacheHitRatio: cacheHits + cacheMisses === 0 ? 0 : cacheHits / (cacheHits + cacheMisses),
      timestamp: timestamp,
    };
    console.log(res.locals.stats);
  } catch (err) {
    return next({
      log: `redisController.getCacheHitsRatio error: ${err}`,
      message: 'Get cache hits middleware error',
      status: 500,
    });
  }

  // console.log('cachehitratio', res.locals.cacheHitRatio);
  return next();
};

//A persistent positive value of this metric is an indication that you need to scale the memory up.
//A positive metric value shows that your expired data is being cleaned up properly
redisController.getEvictedExpired = async (req, res, next) => {
  try {
    //store Redis client from middleware
    const redisClient = req.redisClient;
    //connect to local redis instannce
    // await redisClient.connect();
    // //set one key to get *some* data to see the performance on
    // await redisClient.set('test', 'hello');
    //response is a giant array of comma and newline separated values, with sections delinated by '# <SectionHeader>',
    const stats = await redisClient.info();
    //separate string into individual metrics and store in array
    const metrics = stats.split('\r\n');
    // console.log(metrics);
    let totalKeys = metrics.find((str) => str.startsWith('db'));
    let evicted = metrics.find((str) => str.startsWith('evicted_keys'));
    let expired = metrics.find((str) => str.startsWith('expired_keys'));
    let timestamp = metrics.find((str) => str.startsWith('server_time_usec'));
    totalKeys = Number(totalKeys.slice(totalKeys.indexOf('=') + 1, totalKeys.indexOf(',')));
    evicted = Number(evicted.slice(evicted.indexOf(':') + 1));
    expired = Number(expired.slice(expired.indexOf(':') + 1));
    timestamp = Number(timestamp.slice(timestamp.indexOf(':') + 1));
    // console.log('total keys', totalKeys);
    // console.log('evicted caches', evicted);
    // console.log('expired caches', expired);
    // console.log('timestamp in microseconds since unix epoch', timestamp);
    res.locals.evictedExpired = {
      totalKeys: totalKeys,
      evicted: evicted,
      expired: expired,
      timestamp: timestamp,
    };
    console.log(res.locals.evictedExpired);
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
    //store Redis client from middleware
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
    // time is in microseconds
    avgGetCacheTime = Number(avgGetCacheTime.slice(avgGetCacheTime.indexOf('usec_per_call=') + 14));
    res.locals.latency = {
      commandsProcessed: commandsProcessed,
      avgGetCacheTime: avgGetCacheTime,
      timestamp: timestamp,
    };
    //latency, needs to be enabled
    // const st = await redisClient.info('latencystats');
    console.log(res.locals.latency);
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
    //store Redis client from middleware
    const redisClient = req.redisClient;

    const stats = await redisClient.info('memory');
    // console.log(stats);
    const metrics = stats.split('\r\n');
    //the memory allocated to Redis, size of cache data
    let usedMemory = metrics.find((str) => str.startsWith('used_memory_human'));
    //max amount of memory Redis has consumed.
    let peakUsedMemory = metrics.find((str) => str.startsWith('used_memory_peak_human'));
    //the number is in MB
    usedMemory = Number(usedMemory.slice(usedMemory.indexOf(':') + 1, usedMemory.length - 1));
    peakUsedMemory = Number(
      peakUsedMemory.slice(peakUsedMemory.indexOf(':') + 1, peakUsedMemory.length - 1),
    );
    res.locals.memory = { usedMemory: usedMemory, peakUsedMemory: peakUsedMemory };
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
