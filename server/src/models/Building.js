'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { normalizeForSearch } = require('@src/utils/text');

const BuildingSchema = new Schema(
  {
    campusId: { type: Schema.Types.ObjectId, ref: 'Campus', required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    floors: { type: [Number], default: [] },
    center: { type: [Number], default: [0, 0] }, // [lng, lat]
    searchableText: { type: String, index: true }
  },
  { timestamps: true }
);

BuildingSchema.pre('save', function nextSave(next) {
  this.searchableText = normalizeForSearch([this.name, this.code].filter(Boolean).join(' '));
  next();
});

module.exports = mongoose.model('Building', BuildingSchema);
