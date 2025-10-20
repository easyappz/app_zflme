'use strict';

const express = require('express');
const { listCampuses, getCampusById } = require('@src/controllers/campusesController');

const router = express.Router();

router.get('/', listCampuses);
router.get('/:id', getCampusById);

module.exports = router;
