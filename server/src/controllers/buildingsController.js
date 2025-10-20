'use strict';

const Building = require('@src/models/Building');
const Floor = require('@src/models/Floor');
const Room = require('@src/models/Room');
const { getPagination } = require('@src/utils/pagination');
const { respondWithCache, sendConditionalJSON } = require('@src/utils/http');
const { isValidObjectId, parsePositiveInt } = require('@src/utils/validation');

async function listBuildings(req, res) {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { campusId } = req.query;

    if (campusId && !isValidObjectId(campusId)) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'campusId must be a valid ObjectId',
        details: { campusId }
      });
    }

    const key = `buildings:list:${campusId || 'all'}:${page}:${limit}`;
    return respondWithCache(req, res, key, async () => {
      const filter = {};
      if (campusId) filter.campusId = campusId;
      const [items, total] = await Promise.all([
        Building.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
        Building.countDocuments(filter)
      ]);
      return { page, limit, total, items };
    });
  } catch (error) {
    return res.status(500).json({
      error: error.name || 'ListBuildingsError',
      message: error.message,
      details: { stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined }
    });
  }
}

async function getBuildingById(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'id must be a valid ObjectId',
        details: { id }
      });
    }

    const key = `buildings:byId:${id}`;
    return respondWithCache(req, res, key, async () => {
      const building = await Building.findById(id).lean();
      if (!building) {
        const err = new Error(`Building ${id} not found`);
        err.status = 404;
        err.name = 'NotFound';
        err.details = { id };
        throw err;
      }
      return building;
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      error: error.name || 'GetBuildingError',
      message: error.message,
      details: Object.assign({ id: req.params.id }, error.details || {}, { stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined })
    });
  }
}

async function getBuildingFloors(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'id must be a valid ObjectId',
        details: { id }
      });
    }

    const floors = await Floor.find({ building: id }).select('level updatedAt').sort({ level: 1 }).lean();
    const levels = Array.from(new Set(floors.map((f) => f.level))).sort((a, b) => a - b);

    return sendConditionalJSON(req, res, { buildingId: id, floors: levels, items: floors });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      error: error.name || 'GetBuildingFloorsError',
      message: error.message,
      details: { id: req.params.id, stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined }
    });
  }
}

async function getBuildingFloorPlans(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'id must be a valid ObjectId',
        details: { id }
      });
    }

    const items = await Floor.find({ building: id })
      .select('level planImageUrl updatedAt')
      .sort({ level: 1 })
      .lean();

    return sendConditionalJSON(req, res, { buildingId: id, items });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      error: error.name || 'GetBuildingFloorPlansError',
      message: error.message,
      details: { id: req.params.id, stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined }
    });
  }
}

async function getBuildingRooms(req, res) {
  try {
    const { id } = req.params;
    const { floor } = req.query;
    const { page, limit, skip } = getPagination(req.query);

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'id must be a valid ObjectId',
        details: { id }
      });
    }

    const filter = { buildingId: id };
    if (typeof floor !== 'undefined') {
      const floorNum = parsePositiveInt(floor, null, -1000, 1000);
      if (floorNum === null) {
        return res.status(400).json({
          error: 'ValidationError',
          message: 'floor must be an integer',
          details: { floor }
        });
      }
      filter.floor = floorNum;
    }

    const baseItems = await Room.find(filter).sort({ floor: 1, number: 1 }).lean();
    const total = baseItems.length;
    const items = baseItems.slice(skip, skip + limit);

    return sendConditionalJSON(req, res, { page, limit, total, items });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      error: error.name || 'GetBuildingRoomsError',
      message: error.message,
      details: { id: req.params.id, stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined }
    });
  }
}

module.exports = {
  listBuildings,
  getBuildingById,
  getBuildingFloors,
  getBuildingFloorPlans,
  getBuildingRooms
};
