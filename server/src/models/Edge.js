'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const NodeRefSchema = new Schema(
  {
    room: { type: Schema.Types.ObjectId, ref: 'Room' },
    point: {
      type: [Number],
      validate: {
        validator: (v) => !v || (Array.isArray(v) && v.length === 2 && v.every((n) => typeof n === 'number')),
        message: 'point must be [lng, lat]'
      }
    }
  },
  { _id: false }
);

const EdgeSchema = new Schema(
  {
    building: { type: Schema.Types.ObjectId, ref: 'Building', required: true, index: true },
    floor: { type: Number, required: true, index: true },
    from: { type: NodeRefSchema, required: true },
    to: { type: NodeRefSchema, required: true },
    weight: { type: Number, required: true, default: 1, min: 0 }
  },
  { timestamps: true }
);

EdgeSchema.index({ building: 1, floor: 1 });
EdgeSchema.index({ 'from.room': 1 });
EdgeSchema.index({ 'to.room': 1 });

module.exports = mongoose.model('Edge', EdgeSchema);
