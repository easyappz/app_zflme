'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const GeoPolygonSchema = new Schema(
  {
    type: { type: String, enum: ['Polygon'], default: 'Polygon' },
    coordinates: { type: [[[Number]]], required: true }
  },
  { _id: false }
);

const CampusSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true, unique: true },
    center: {
      type: [Number],
      required: true,
      index: '2dsphere',
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 2 && v.every((n) => typeof n === 'number'),
        message: 'center must be [lng, lat]'
      }
    },
    bounds: { type: GeoPolygonSchema, required: false },
    city: { type: String, required: true, trim: true },
    description: { type: String, trim: true }
  },
  { timestamps: true }
);

CampusSchema.index({ bounds: '2dsphere' });
CampusSchema.index({ city: 1 });
CampusSchema.index({ name: 1 });

module.exports = mongoose.model('Campus', CampusSchema);
