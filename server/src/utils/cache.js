'use strict';

const LRU = require('lru-cache');

const cache = new LRU({
  max: 500,
  ttl: 30 * 1000 // 30 seconds default TTL
});

function get(key) {
  return cache.get(key);
}

function set(key, value, ttlMs) {
  if (typeof ttlMs === 'number') {
    cache.set(key, value, { ttl: ttlMs });
  } else {
    cache.set(key, value);
  }
}

function del(key) {
  cache.delete(key);
}

module.exports = { get, set, del };
