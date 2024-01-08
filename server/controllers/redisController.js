const { createClient } = require('redis');
const User = require('../models/userModel');
const redisController = {};
require('dotenv').config();

//connect to user's redis instance stored in user database

//consider having one persistent connection vs creating and closing a connection for each route?
//or one connection that opens and closes, but fetches data for each route during the one fetch
redisController.connectUserRedis = async (req, res, next) => {
  try {
    const userID = req.cookies.ssid;
    const user = await User.findById(userID);
    const { host, port, redisPassword } = user;
    //consider refactor to support either/or for local vs cloud vs API key vs certificate
    //if we just assemble the URI it may be possible to be cloud/local agnostic
    //ie jsut redisURL for both and maybe API if API key is passed as password
    const redisClient = createClient({
      password: redisPassword,
      //password: process.env.REDIS_API;
      socket: {
        host,
        port,
      },
    });
    // const redisURL = `redis://${redisPassword}@${host}:${port}`;
    // const redisClient = createClient({
    //   url: `redis://${process.env.REDIS_API}@${host}:${port}`;
    //   //url: redisURL
    // });
    //does the client need to be *connected* yet?
    await redisClient.connect();
    await redisClient.on('ready', () => console.log('server_info:', redisClient.server_info));

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

//close redis connection
//prevent ERR max number of clients reached
redisController.disconnectRedis = async (req, res, next) => {
  try {
    //what's better disconnect() or quit() or end()? disconnect shows up in
    //redis-node github docs, but nowhere else
    //https://github.com/redis/node-redis/blob/5a96058c2f77c1278a0438ca5923f0772cf74790/packages/client/lib/client/index.ts#L845
    //or the readme.md
    //quit() is a more "graceful" quit -- executing any remaining commands in queue before closing
    //disconnect() ends immediately, and any pending replies are lost
    //does this need an await? disconnect() returns a promise;
    //added an await below, performs the same, probably "better" overall
    //console.log(req.redisClient.server_info);
    await req.redisClient.disconnect();
    // console.log('Redis disconnected!');
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

//TODO:
//refactor various gets to all one pull from redis
//redisController.getAllStats
//redisController.parse[StatName]
//then specific middlewares to parse the pulled data into individual stats

//we parse
redisController.getCacheHitsRatio = async (req, res, next) => {
  try {
    //store Redis client from middleware
    const redisClient = req.redisClient;

    //can use .info('all') to pull all sections and not just default sections
    //would include CommandStats that isn't included in default
    const stats = await redisClient.info();
    //response is a giant array of comma and newline separated values, with sections delinated by '# <SectionHeader>',

    //separate string into individual metrics and store in array
    const metrics = stats.split('\r\n');
    //every line in stats becomes its own element in the array
    let cacheHits = metrics.find((str) => str.startsWith('keyspace_hits'));
    // '#Stats
    // keyspace_hits: 1007'
    let cacheMisses = metrics.find((str) => str.startsWith('keyspace_misses'));
    let timestamp = metrics.find((str) => str.startsWith('server_time_usec'));

    //consider adding validation in case any of the stats aren't present in the stats returned

    //cacheHits will look like 'keyspace_hits : 1007'
    cacheHits = Number(cacheHits.slice(cacheHits.indexOf(':') + 1));
    cacheMisses = Number(cacheMisses.slice(cacheMisses.indexOf(':') + 1));
    timestamp = Number(timestamp.slice(timestamp.indexOf(':') + 1));

    //if ratio lower than -0.8,  then a significant amount of the requested keys are evicted, expired, or do not exist at all

    res.locals.stats = {
      cacheHitRatio: cacheHits + cacheMisses === 0 ? 0 : cacheHits / (cacheHits + cacheMisses),
      timestamp: timestamp,
    };
  } catch (err) {
    return next({
      log: `redisController.getCacheHitsRatio error: ${err}`,
      message: 'Get cache hits middleware error',
      status: 500,
    });
  }

  return next();
};

//A persistent positive value of this metric is an indication that you need to scale the memory up.
//A positive metric value shows that your expired data is being cleaned up properly
redisController.getEvictedExpired = async (req, res, next) => {
  try {
    const redisClient = req.redisClient;
    const stats = await redisClient.info();
    const metrics = stats.split('\r\n');
    // console.log(metrics);
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
    // console.log(res.locals.evictedExpired);
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

    //could just do one call to info() as info('all') to get both info and commandStats
    const cmdstats = await redisClient.info('commandstats');
    //console.log('cmdstat in RT: ', cmdstats);

    const cmdmetrics = cmdstats.split('\r\n');
    //console.log('cmdmetrics: ', cmdmetrics);
    let avgGetCacheTime = cmdmetrics.find((str) => str.startsWith('cmdstat_get'));
    //console.log('avgGetCacheTime in RT: ', avgGetCacheTime);
    let totalGet = avgGetCacheTime;
    // console.log('*******', avgGetCacheTime);
    // time is in microseconds
    avgGetCacheTime = Number(avgGetCacheTime.slice(avgGetCacheTime.indexOf('usec_per_call=') + 14));
    totalGet = Number(totalGet.slice(totalGet.indexOf('calls=') + 6, totalGet.indexOf(',')));
    res.locals.latency = {
      commandsProcessed: commandsProcessed,
      totalGet: totalGet,
      avgGetCacheTime: avgGetCacheTime,
      timestamp: timestamp,
    };
    //latency, needs to be enabled
    // const st = await redisClient.info('latencystats');
    // console.log(res.locals.latency);
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
    //total memory
    let totalMemory = metrics.find((str) => str.startsWith('total_system_memory_human'));
    //the number is in MB
    usedMemory = Number(usedMemory.slice(usedMemory.indexOf(':') + 1, usedMemory.length - 1));
    peakUsedMemory = Number(
      peakUsedMemory.slice(peakUsedMemory.indexOf(':') + 1, peakUsedMemory.length - 1),
    );
    // console.log(stats);
    // totalMemory = Number(totalMemory.slice(totalMemory.indexOf(':') + 1, totalMemory.length - 1));
    res.locals.memory = {
      usedMemory: usedMemory,
      peakUsedMemory: peakUsedMemory,
      // totalMemory: totalMemory,
    };
    // console.log(res.locals.memory);
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
