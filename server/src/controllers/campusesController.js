'use strict';

const Campus = require('@src/models/Campus');
const { getPagination } = require('@src/utils/pagination');

async function listCampuses(req, res) {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const [items, total] = await Promise.all([
      Campus.find({}).sort({ name: 1 }).skip(skip).limit(limit).lean(),
      Campus.countDocuments({})
    ]);
    res.status(200).json({ page, limit, total, items });
  } catch (error) {
    res.status(500).json({
      error: error.name || 'ListCampusesError',
      message: error.message,
      details: { stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined }
    });
  }
}

async function getCampusById(req, res) {
  try {
    const { id } = req.params;
    const campus = await Campus.findById(id).lean();
    if (!campus) {
      return res.status(404).json({
        error: 'NotFound',
        message: `Campus ${id} not found`,
        details: { id }
      });
    }
    res.status(200).json(campus);
  } catch (error) {
    res.status(500).json({
      error: error.name || 'GetCampusError',
      message: error.message,
      details: { id: req.params.id, stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined }
    });
  }
}

module.exports = { listCampuses, getCampusById };
