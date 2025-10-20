'use strict';

const express = require('express');
const { listRooms } = require('@src/controllers/roomsController');

const router = express.Router();

router.get('/', listRooms);

module.exports = router;
