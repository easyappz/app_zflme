'use strict';

const express = require('express');
const { buildRoute } = require('@src/controllers/navigationController');

const router = express.Router();

router.post('/route', buildRoute);

module.exports = router;
