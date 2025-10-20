'use strict';

const express = require('express');
const { listBuildings, getBuildingById, getBuildingFloors, getBuildingRooms, getBuildingFloorPlans } = require('@src/controllers/buildingsController');

const router = express.Router();

router.get('/', listBuildings);
router.get('/:id', getBuildingById);
router.get('/:id/floors', getBuildingFloors);
router.get('/:id/rooms', getBuildingRooms);
router.get('/:id/floor-plans', getBuildingFloorPlans);

module.exports = router;
