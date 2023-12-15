const express = require('express');
// const Redis = require('redis');
// const redisClient = Redis.createClient();
const redisController = {};

//efficiency of cache usage metric
redisController.getCacheHitsRatio = async (req, res, next) => {
  //store Redis client from middleware
  const redisClient = req.redisClient;
  //connect to local redis instannce
  // await redisClient.connect();
  // //set one key to get *some* data to see the performance on
  // await redisClient.set('test', 'hello');
  //response is a giant array of comma and newline separated values, with sections delinated by '# <SectionHeader>',
  const stats = await redisClient.info('stats');
  //separate string into individual metrics and store in array
  const metrics = stats.split('\r\n');
  let cacheHits = metrics.find((str) => str.startsWith('keyspace_hits'));
  let cacheMisses = metrics.find((str) => str.startsWith('keyspace_misses'));
  cacheHits = Number(cacheHits.slice(cacheHits.indexOf(':') + 1));
  cacheMisses = Number(cacheMisses.slice(cacheMisses.indexOf(':') + 1));
  console.log('hits', cacheHits);
  console.log('misses', cacheMisses);
  //if ratio lower than -0.8,  then a significant amount of the requested keys are evicted, expired, or do not exist at all
  if (cacheHits + cacheMisses === 0) res.locals.cacheHitRatio = 0;
  else {
    res.locals.cacheHitRatio = cacheHits / (cacheHits + cacheMisses);
  }
  console.log('cachehitratio', res.locals.cacheHitRatio);
  return next();
};

//A persistent positive value of this metric is an indication that you need to scale the memory up.
//A positive metric value shows that your expired data is being cleaned up properly
redisController.getEvictedExpired = async (req, res, next) => {
  //store Redis client from middleware
  const redisClient = req.redisClient;
  //connect to local redis instannce
  // await redisClient.connect();
  // //set one key to get *some* data to see the performance on
  // await redisClient.set('test', 'hello');
  //response is a giant array of comma and newline separated values, with sections delinated by '# <SectionHeader>',
  const stats = await redisClient.info('stats');
  //separate string into individual metrics and store in array
  const metrics = stats.split('\r\n');
  let evicted = metrics.find((str) => str.startsWith('evicted_keys'));
  let expired = metrics.find((str) => str.startsWith('expired_keys'));
  evicted = Number(evicted.slice(evicted.indexOf(':') + 1));
  expired = Number(expired.slice(expired.indexOf(':') + 1));
  console.log('evicted caches', evicted);
  console.log('expired caches', expired);
  res.locals.evictedExpired = { evicted: evicted, expired: expired };
  console.log(res.locals.evictedExpired);
  return next();
};

redisController.getResponseTimes = async (req, res, next) => {
  //store Redis client from middleware
  const redisClient = req.redisClient;

  const stats = await redisClient.info('stats');
  const metrics = stats.split('\r\n');
  let commandsProcessed = metrics.find((str) => str.startsWith('total_commands_processed'));
  commandsProcessed = Number(commandsProcessed.slice(commandsProcessed.indexOf(':') + 1));

  const cmdstats = await redisClient.info('commandstats');
  const cmdmetrics = cmdstats.split('\r\n');
  let avgGetCacheTime = cmdmetrics.find((str) => str.startsWith('cmdstat_get'));
  // time is in microseconds
  avgGetCacheTime = Number(avgGetCacheTime.slice(avgGetCacheTime.indexOf('usec_per_call=') + 14));
  res.locals.latency = { commandsProcessed: commandsProcessed, avgGetCacheTime: avgGetCacheTime };
  //latency, needs to be enabled
  // const st = await redisClient.info('latencystats');

  return next();
};
//memory usage
redisController.getMemory = async (req, res, next) => {
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
};

module.exports = redisController;
