'use strict';

function getPagination(query) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limitRaw = parseInt(query.limit, 10);
  const limit = Math.min(Math.max(isNaN(limitRaw) ? 20 : limitRaw, 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

module.exports = { getPagination };
