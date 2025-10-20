'use strict';

const Campus = require('@src/models/Campus');
const Building = require('@src/models/Building');
const Room = require('@src/models/Room');
const { normalizeForSearch } = require('@src/utils/text');

async function searchAll(req, res) {
  try {
    const { q = '', campusId, buildingId } = req.query;
    const query = normalizeForSearch(q);

    // Campuses
    let campuses = await Campus.find({}).lean();
    if (query) {
      campuses = campuses.filter((c) => (c.searchableText || '').includes(query));
    }

    // Buildings (filter by campus if provided)
    const buildingFilter = {};
    if (campusId) buildingFilter.campusId = campusId;
    let buildings = await Building.find(buildingFilter).lean();
    if (query) {
      buildings = buildings.filter((b) => (b.searchableText || '').includes(query));
    }

    // Rooms (filter by campus/building if provided)
    const roomFilter = {};
    if (buildingId) roomFilter.buildingId = buildingId;
    let rooms = await Room.find(roomFilter).lean();
    if (query) {
      rooms = rooms.filter((r) => (r.searchableText || '').includes(query));
    }

    const campusCards = campuses.map((c) => ({
      id: c._id,
      type: 'campus',
      title: c.name,
      subtitle: c.code || '',
      center: c.center
    }));

    const buildingCards = buildings.map((b) => ({
      id: b._id,
      type: 'building',
      campusId: b.campusId,
      title: b.name,
      subtitle: b.code || '',
      center: b.center
    }));

    const roomCards = rooms.map((r) => ({
      id: r._id,
      type: 'room',
      buildingId: r.buildingId,
      title: r.name || r.number || 'Room',
      subtitle: r.number ? `#${r.number}` : '',
      floor: r.floor,
      point: r.point
    }));

    res.status(200).json({ query: q, campuses: campusCards, buildings: buildingCards, rooms: roomCards });
  } catch (error) {
    res.status(500).json({
      error: error.name || 'SearchError',
      message: error.message,
      details: { stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined }
    });
  }
}

module.exports = { searchAll };
