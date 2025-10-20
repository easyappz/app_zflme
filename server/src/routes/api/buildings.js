'use strict';

const express = require('express');
const { listBuildings, getBuildingById, getBuildingFloors, getBuildingRooms } = require('@src/controllers/buildingsController');

const router = express.Router();

router.get('/', listBuildings);
router.get('/:id', getBuildingById);
router.get('/:id/floors', getBuildingFloors);
router.get('/:id/rooms', getBuildingRooms);

module.exports = router;
