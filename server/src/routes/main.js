'use strict';

const express = require('express');

const campusesRouter = require('@src/routes/api/campuses');
const buildingsRouter = require('@src/routes/api/buildings');
const roomsRouter = require('@src/routes/api/rooms');
const searchRouter = require('@src/routes/api/search');
const navigationRouter = require('@src/routes/api/navigation');

const router = express.Router();

router.get('/status', async (req, res) => {
  try {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      error: error.name || 'ServerError',
      message: error.message,
      details: { stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined }
    });
  }
});

router.use('/campuses', campusesRouter);
router.use('/buildings', buildingsRouter);
router.use('/rooms', roomsRouter);
router.use('/search', searchRouter);
router.use('/navigation', navigationRouter);

module.exports = router;
