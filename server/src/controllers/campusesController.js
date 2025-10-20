'use strict';

const Campus = require('@src/models/Campus');
const { getPagination } = require('@src/utils/pagination');
const { respondWithCache } = require('@src/utils/http');
const { isValidObjectId } = require('@src/utils/validation');

async function listCampuses(req, res) {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const key = `campuses:list:${page}:${limit}`;

    return respondWithCache(req, res, key, async () => {
      const [items, total] = await Promise.all([
        Campus.find({}).sort({ name: 1 }).skip(skip).limit(limit).lean(),
        Campus.countDocuments({})
      ]);
      return { page, limit, total, items };
    });
  } catch (error) {
    return res.status(500).json({
      error: error.name || 'ListCampusesError',
      message: error.message,
      details: { stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined }
    });
  }
}

async function getCampusById(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'id must be a valid ObjectId',
        details: { id }
      });
    }

    const key = `campuses:byId:${id}`;
    return respondWithCache(req, res, key, async () => {
      const campus = await Campus.findById(id).lean();
      if (!campus) {
        const err = new Error(`Campus ${id} not found`);
        err.status = 404;
        err.name = 'NotFound';
        err.details = { id };
        throw err;
      }
      return campus;
    });
  } catch (error) {
    return res.status(500).json({
      error: error.name || 'GetCampusError',
      message: error.message,
      details: { id: req.params.id, stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined }
    });
  }
}

module.exports = { listCampuses, getCampusById };
