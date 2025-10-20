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

const FloorSchema = new Schema(
  {
    building: { type: Schema.Types.ObjectId, ref: 'Building', required: true, index: true },
    level: { type: Number, required: true },
    planImageUrl: { type: String, trim: true },
    bbox: { type: GeoPolygonSchema }
  },
  { timestamps: true }
);

FloorSchema.index({ building: 1, level: 1 }, { unique: true });

module.exports = mongoose.model('Floor', FloorSchema);
