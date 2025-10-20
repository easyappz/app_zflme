'use strict';

const express = require('express');

const router = express.Router();

function createPlaceholderRouter(resource) {
  const r = express.Router();

  r.get('/', async (req, res) => {
    try {
      res.status(200).json({
        resource,
        items: [],
        message: 'Not implemented yet'
      });
    } catch (error) {
      res.status(500).json({
        error: error.name || 'ServerError',
        message: error.message,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
      });
    }
  });

  return r;
}

const campusesRouter = createPlaceholderRouter('campuses');
const buildingsRouter = createPlaceholderRouter('buildings');
const roomsRouter = createPlaceholderRouter('rooms');

const searchRouter = express.Router();
searchRouter.get('/', async (req, res) => {
  try {
    res.status(200).json({
      query: req.query.q || '',
      results: [],
      message: 'Not implemented yet'
    });
  } catch (error) {
    res.status(500).json({
      error: error.name || 'ServerError',
      message: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

const navigationRouter = express.Router();
navigationRouter.post('/route', async (req, res) => {
  try {
    res.status(200).json({
      route: [],
      distance: 0,
      time: 0,
      message: 'Not implemented yet'
    });
  } catch (error) {
    res.status(500).json({
      error: error.name || 'ServerError',
      message: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// Basic endpoints with try/catch
router.get('/hello', async (req, res) => {
  try {
    res.json({ message: 'Hello from API!' });
  } catch (error) {
    res.status(500).json({
      error: error.name || 'ServerError',
      message: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

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
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// Sub-routers
router.use('/campuses', campusesRouter);
router.use('/buildings', buildingsRouter);
router.use('/rooms', roomsRouter);
router.use('/search', searchRouter);
router.use('/navigation', navigationRouter);

module.exports = router;
