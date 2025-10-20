'use strict';

const express = require('express');
const { searchAll, suggest } = require('@src/controllers/searchController');

const router = express.Router();

router.get('/', searchAll);
router.get('/suggest', suggest);

module.exports = router;
