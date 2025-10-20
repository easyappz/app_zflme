'use strict';

const Campus = require('@src/models/Campus');
const Building = require('@src/models/Building');
const Room = require('@src/models/Room');
const { normalizeForSearch } = require('@src/utils/text');
const { respondWithCache, sendConditionalJSON } = require('@src/utils/http');
const { parsePositiveInt } = require('@src/utils/validation');

async function searchAll(req, res) {
  try {
    const { q = '', campusId, buildingId } = req.query;
    const limit = parsePositiveInt(req.query.limit, 20, 1, 100);
    const query = normalizeForSearch(q);

    const cacheKey = `search:all:q:${query}:campus:${campusId || 'all'}:building:${buildingId || 'all'}:limit:${limit}`;

    return respondWithCache(req, res, cacheKey, async () => {
      // Campuses
      let campuses = await Campus.find({}).lean();
      if (query) {
        campuses = campuses.filter((c) => (c.searchableText || '').includes(query));
      }

      // Buildings
      const buildingFilter = {};
      if (campusId) buildingFilter.campusId = campusId;
      let buildings = await Building.find(buildingFilter).lean();
      if (query) {
        buildings = buildings.filter((b) => (b.searchableText || '').includes(query));
      }

      // Rooms
      const roomFilter = {};
      if (buildingId) roomFilter.buildingId = buildingId;
      let rooms = await Room.find(roomFilter).lean();
      if (query) {
        rooms = rooms.filter((r) => (r.searchableText || '').includes(query));
      }

      const campusCards = campuses.slice(0, limit).map((c) => ({
        id: c._id,
        type: 'campus',
        title: c.name,
        subtitle: c.code || '',
        center: c.center
      }));

      const buildingCards = buildings.slice(0, limit).map((b) => ({
        id: b._id,
        type: 'building',
        campusId: b.campusId,
        title: b.name,
        subtitle: b.code || '',
        center: b.center
      }));

      const roomCards = rooms.slice(0, limit).map((r) => ({
        id: r._id,
        type: 'room',
        buildingId: r.buildingId,
        title: r.name || r.number || 'Room',
        subtitle: r.number ? `#${r.number}` : '',
        floor: r.floor,
        point: r.point
      }));

      return { query: q, campuses: campusCards, buildings: buildingCards, rooms: roomCards };
    });
  } catch (error) {
    return res.status(500).json({
      error: error.name || 'SearchError',
      message: error.message,
      details: { stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined }
    });
  }
}

async function suggest(req, res) {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : '';
    const limit = parsePositiveInt(req.query.limit, 10, 1, 50);
    const query = normalizeForSearch(q);

    if (!query) {
      return sendConditionalJSON(req, res, { query: q, items: [] });
    }

    const cacheKey = `search:suggest:q:${query}:limit:${limit}`;

    return respondWithCache(req, res, cacheKey, async () => {
      const [buildings, rooms] = await Promise.all([
        Building.find({}).select('name code center searchableText').lean(),
        Room.find({}).select('name number floor buildingId point searchableText').lean()
      ]);

      const buildingItems = buildings
        .filter((b) => (b.searchableText || '').includes(query))
        .map((b) => ({
          type: 'building',
          id: b._id,
          title: b.name,
          subtitle: b.code || '',
          center: b.center
        }));

      const roomItems = rooms
        .filter((r) => (r.searchableText || '').includes(query))
        .map((r) => ({
          type: 'room',
          id: r._id,
          buildingId: r.buildingId,
          title: r.name || r.number || 'Room',
          subtitle: r.number ? `#${r.number}` : '',
          floor: r.floor,
          point: r.point
        }));

      // Merge with simple prioritization: buildings first, then rooms
      const items = [...buildingItems, ...roomItems].slice(0, limit);
      return { query: q, items };
    }, 20_000);
  } catch (error) {
    return res.status(500).json({
      error: error.name || 'SuggestError',
      message: error.message,
      details: { stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined }
    });
  }
}

module.exports = { searchAll, suggest };
