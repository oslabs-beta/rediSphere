const request = require('supertest');
//const assert = require('assert');
const server = `http://localhost:${process.env.PORT}`;

describe('testing api endpoint', function () {
  test('get:/api/memory', function () {
    request(server)
      .get('/api/memory')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  }, 10000);

  test('get:/api/cacheHitsRatio', function () {
    request(server)
      .get('/api/cacheHitsRatio')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  }, 10000);

  test('get:/api/evictedExpired', function () {
    request(server)
      .get('/api/evictedExpired')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  }, 10000);

  test('get:/api/latency', function () {
    request(server)
      .get('/api/latency')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  }, 10000);
});
