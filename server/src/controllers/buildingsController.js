'use strict';

const Building = require('@src/models/Building');
const Room = require('@src/models/Room');
const Floor = require('@src/models/Floor');
const { getPagination } = require('@src/utils/pagination');

async function listBuildings(req, res) {
  try {
    const { campusId } = req.query;
    const { page, limit, skip } = getPagination(req.query);
    const filter = {};
    if (campusId) filter.campusId = campusId;

    const [items, total] = await Promise.all([
      Building.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
      Building.countDocuments(filter)
    ]);

    res.status(200).json({ page, limit, total, items });
  } catch (error) {
    res.status(500).json({
      error: error.name || 'ListBuildingsError',
      message: error.message,
      details: { stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined }
    });
  }
}

async function getBuildingById(req, res) {
  try {
    const { id } = req.params;
    const building = await Building.findById(id).lean();
    if (!building) {
      return res.status(404).json({
        error: 'NotFound',
        message: `Building ${id} not found`,
        details: { id }
      });
    }
    res.status(200).json(building);
  } catch (error) {
    res.status(500).json({
      error: error.name || 'GetBuildingError',
      message: error.message,
      details: { id: req.params.id, stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined }
    });
  }
}

async function getBuildingFloors(req, res) {
  try {
    const { id } = req.params;
    // distinct floors from rooms in this building
    const floors = await Room.distinct('floor', { buildingId: id });
    floors.sort((a, b) => a - b);
    res.status(200).json({ buildingId: id, floors });
  } catch (error) {
    res.status(500).json({
      error: error.name || 'GetBuildingFloorsError',
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

    const filter = { buildingId: id };
    if (typeof floor !== 'undefined') {
      const floorNum = Number(floor);
      if (!Number.isNaN(floorNum)) filter.floor = floorNum;
    }

    const [items, total] = await Promise.all([
      Room.find(filter).sort({ floor: 1, number: 1 }).skip(skip).limit(limit).lean(),
      Room.countDocuments(filter)
    ]);

    res.status(200).json({ page, limit, total, items });
  } catch (error) {
    res.status(500).json({
      error: error.name || 'GetBuildingRoomsError',
      message: error.message,
      details: { id: req.params.id, stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined }
    });
  }
}

async function getBuildingFloorPlans(req, res) {
  try {
    const { id } = req.params;
    const floors = await Floor.find({ building: id }).lean();
    const items = floors
      .map((f) => ({
        level: f.level,
        planImageUrl: f.planImageUrl || '',
        bbox: f.bbox || null
      }))
      .sort((a, b) => a.level - b.level);
    res.status(200).json({ buildingId: id, items });
  } catch (error) {
    res.status(500).json({
      error: error.name || 'GetBuildingFloorPlansError',
      message: error.message,
      details: { id: req.params.id, stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined }
    });
  }
}

module.exports = { listBuildings, getBuildingById, getBuildingFloors, getBuildingRooms, getBuildingFloorPlans };