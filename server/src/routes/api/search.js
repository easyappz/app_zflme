'use strict';

const express = require('express');
const { searchAll } = require('@src/controllers/searchController');

const router = express.Router();

router.get('/', searchAll);

module.exports = router;
