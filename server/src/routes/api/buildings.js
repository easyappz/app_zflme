'use strict';

const express = require('express');
const {
  listBuildings,
  getBuildingById,
  getBuildingFloors,
  getBuildingFloorPlans,
  getBuildingRooms
} = require('@src/controllers/buildingsController');

const router = express.Router();

router.get('/', listBuildings);
router.get('/:id', getBuildingById);
router.get('/:id/floors', getBuildingFloors);
router.get('/:id/floor-plans', getBuildingFloorPlans);
router.get('/:id/rooms', getBuildingRooms);

module.exports = router;
