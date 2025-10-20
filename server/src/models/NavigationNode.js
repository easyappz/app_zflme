'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const NavigationNodeSchema = new Schema(
  {
    buildingId: { type: Schema.Types.ObjectId, ref: 'Building', required: true, index: true },
    floor: { type: Number, required: true, index: true },
    point: { type: [Number], required: true }, // [lng, lat]
    label: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('NavigationNode', NavigationNodeSchema);
