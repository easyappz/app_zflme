'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { normalizeForSearch } = require('@src/utils/text');

const CampusSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    center: { type: [Number], default: [0, 0] }, // [lng, lat]
    searchableText: { type: String, index: true }
  },
  { timestamps: true }
);

CampusSchema.pre('save', function nextSave(next) {
  this.searchableText = normalizeForSearch([this.name, this.code].filter(Boolean).join(' '));
  next();
});

module.exports = mongoose.model('Campus', CampusSchema);
