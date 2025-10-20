'use strict';

const { createHash } = require('crypto');
const cache = require('@src/utils/cache');

function computeEtag(data) {
  const json = JSON.stringify(data);
  const hash = createHash('sha1').update(json).digest('hex');
  return `W/"${hash}"`;
}

function toHttpDate(date) {
  if (!date) return undefined;
  try {
    const d = date instanceof Date ? date : new Date(date);
    return isNaN(d.getTime()) ? undefined : d.toUTCString();
  } catch (_) {
    return undefined;
  }
}

function extractLastModified(data) {
  // Try to find latest updatedAt among items
  let latest = undefined;
  const consider = (doc) => {
    if (!doc) return;
    const d = doc.updatedAt || doc.modifiedAt || doc.updated_at;
    if (!d) return;
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return;
    if (!latest || dt > latest) latest = dt;
  };

  if (Array.isArray(data)) {
    data.forEach(consider);
  } else if (data && Array.isArray(data.items)) {
    data.items.forEach(consider);
  } else if (data && typeof data === 'object') {
    consider(data);
  }

  return latest ? latest.toUTCString() : undefined;
}

function applyConditionalHeaders(req, res, payload) {
  const etag = computeEtag(payload);
  const ifNoneMatch = req.headers['if-none-match'];
  if (ifNoneMatch && ifNoneMatch === etag) {
    res.setHeader('ETag', etag);
    return { notModified: true, etag };
  }
  const lastModified = extractLastModified(payload);
  if (lastModified) res.setHeader('Last-Modified', lastModified);
  res.setHeader('ETag', etag);
  return { notModified: false, etag };
}

async function respondWithCache(req, res, key, producer, ttlMs = 30_000) {
  try {
    const cached = cache.get(key);
    if (cached) {
      // Conditional check against cached ETag
      const ifNoneMatch = req.headers['if-none-match'];
      if (ifNoneMatch && ifNoneMatch === cached.etag) {
        res.setHeader('ETag', cached.etag);
        if (cached.lastModified) res.setHeader('Last-Modified', cached.lastModified);
        return res.status(304).end();
      }
      res.setHeader('ETag', cached.etag);
      if (cached.lastModified) res.setHeader('Last-Modified', cached.lastModified);
      return res.status(200).json(cached.data);
    }

    const data = await producer();
    const etag = computeEtag(data);
    const lastModified = extractLastModified(data);

    cache.set(key, { data, etag, lastModified }, ttlMs);

    const ifNoneMatch = req.headers['if-none-match'];
    if (ifNoneMatch && ifNoneMatch === etag) {
      res.setHeader('ETag', etag);
      if (lastModified) res.setHeader('Last-Modified', lastModified);
      return res.status(304).end();
    }

    res.setHeader('ETag', etag);
    if (lastModified) res.setHeader('Last-Modified', lastModified);
    return res.status(200).json(data);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      error: error.name || 'ServerError',
      message: error.message,
      details: Object.assign({}, error.details || {}, { stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined })
    });
  }
}

function sendConditionalJSON(req, res, data) {
  try {
    const cond = applyConditionalHeaders(req, res, data);
    if (cond.notModified) return res.status(304).end();
    return res.status(200).json(data);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      error: error.name || 'ServerError',
      message: error.message,
      details: { stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined }
    });
  }
}

module.exports = { respondWithCache, sendConditionalJSON };
