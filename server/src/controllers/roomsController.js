'use strict';

const Room = require('@src/models/Room');
const { getPagination } = require('@src/utils/pagination');
const { normalizeForSearch } = require('@src/utils/text');

async function listRooms(req, res) {
  try {
    const { buildingId, floor, query } = req.query;
    const { page, limit, skip } = getPagination(req.query);

    const filter = {};
    if (buildingId) filter.buildingId = buildingId;
    if (typeof floor !== 'undefined') {
      const floorNum = Number(floor);
      if (!Number.isNaN(floorNum)) filter.floor = floorNum;
    }

    // Fetch base set then filter with includes (no regex)
    const baseItems = await Room.find(filter)
      .sort({ floor: 1, number: 1 })
      .lean();

    let items = baseItems;
    if (query && query.trim()) {
      const q = normalizeForSearch(query);
      items = baseItems.filter((r) => (r.searchableText || '').includes(q));
    }

    const total = items.length;
    const paged = items.slice(skip, skip + limit);

    res.status(200).json({ page, limit, total, items: paged });
  } catch (error) {
    res.status(500).json({
      error: error.name || 'ListRoomsError',
      message: error.message,
      details: { stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined }
    });
  }
}

module.exports = { listRooms };
