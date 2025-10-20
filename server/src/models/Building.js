'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const EntranceSchema = new Schema(
  {
    name: { type: String, trim: true },
    location: {
      type: [Number],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 2 && v.every((n) => typeof n === 'number'),
        message: 'entrance.location must be [lng, lat]'
      }
    }
  },
  { _id: false }
);

const BuildingSchema = new Schema(
  {
    campus: { type: Schema.Types.ObjectId, ref: 'Campus', required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    address: { type: String, trim: true },
    location: {
      type: [Number],
      required: true,
      index: '2dsphere',
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 2 && v.every((n) => typeof n === 'number'),
        message: 'location must be [lng, lat]'
      }
    },
    entrances: { type: [EntranceSchema], default: [] },
    floors: { type: [Number], default: [] },
    description: { type: String, trim: true }
  },
  { timestamps: true }
);

BuildingSchema.index({ campus: 1, code: 1 }, { unique: true });
BuildingSchema.index({ name: 1 });

module.exports = mongoose.model('Building', BuildingSchema);
