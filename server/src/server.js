'use strict';

require('module-alias/register');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const apiRoutes = require('@src/routes/main');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection (mongoose)
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
})();

// Routes
app.use('/api', apiRoutes);

// Serve API schema (YAML)
app.get('/api/schema', async (req, res) => {
  try {
    const schemaPath = path.join(__dirname, 'api_schema.yaml'); // server/src/api_schema.yaml
    const yamlContent = await fs.promises.readFile(schemaPath, 'utf8');
    res.setHeader('Content-Type', 'application/x-yaml; charset=utf-8');
    res.status(200).send(yamlContent);
  } catch (error) {
    res.status(500).json({
      error: 'FailedToReadSchema',
      message: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'NotFound',
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.name || 'ServerError',
    message: err.message || 'Unexpected server error',
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});

module.exports = app;
