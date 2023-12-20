/**
 * Redis client module with TLS support
 * @module redisClient
 */

const Redis = require('redis');
const tls = require('tls');
const fs = require('fs');
const crypto = require('crypto');

//Class w/Redis Client object
class RedisClient {
  /**
   * Create a RedisClient
   * @param {object} options - Options
   * @param {string} options.host - Redis host
   * @param {number} options.port - Redis port
   * @param {string} options.password - Redis_PASS OR Redis_PRIVATE_API_KEY
   * @param {object} [options.tls] - TLS config
   */
  constructor(options) {
    //if private key provided as param
    if (options.tls) {
      //create the certs needed
      const tlsConfig = this.createTLSConfig(options.tls);
      //pass the certs in and connect over TLS
      this.client = this.createSecureClient(options, tlsConfig);
    } else {
      //or, if not provided, just use the rest of the options info to create the file -- password  = private key
      this.client = Redis.createClient(options);
    }
  }

  /**
   * connect client and log out success/failure
   */
  connect() {
    this.client.on('connect', () => {
      console.log('Connected to Redis!');
    });

    this.client.on('error', (err) => {
      console.log('Redis client error', err);
    });
  }

  /**
   * Generate a self-signed TLS certificate
   * @returns {object} { key, cert }
   */
  generateCertificate() {
    const keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    return {
      key: keyPair.privateKey,
      cert: keyPair.publicKey,
    };
  }

  /**
   * Create TLS config from certs
   * @param {object} tlsOpts - TLS options
   * @returns {object} TLS config
   */
  createTLSConfig(tlsOpts) {
    if (!tlsOpts.key || !tlsOpts.cert) {
      const newCert = this.generateCertificate();
      tlsOpts.key = newCert.key;
      tlsOpts.cert = newCert.cert;
    }

    const key = fs.readFileSync(tlsOpts.key);
    const cert = fs.readFileSync(tlsOpts.cert);

    return {
      key,
      cert,
      rejectUnauthorized: false,
    };
  }

  /**
   * Create secure Redis client with TLS socket
   * @param {object} redisConf - Redis config
   * @param {object} tlsConf - TLS config
   */
  createSecureClient(redisConf, tlsConf) {
    const tlsSocket = tls.connect(redisConf, tlsConf);

    return Redis.createClient(redisConf, {
      socket: tlsSocket,
    });
  }
}

const myConnection = RedisClient.createSe;

module.exports = RedisClient;
