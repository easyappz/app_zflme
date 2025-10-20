'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoomSchema = new Schema(
  {
    building: { type: Schema.Types.ObjectId, ref: 'Building', required: true, index: true },
    floor: { type: Number, required: true, index: true },
    number: { type: String, required: true, trim: true, index: true },
    name: { type: String, trim: true },
    type: { type: String, trim: true },
    centroid: {
      type: [Number],
      validate: {
        validator: (v) => !v || (Array.isArray(v) && v.length === 2 && v.every((n) => typeof n === 'number')),
        message: 'centroid must be [lng, lat]'
      }
    },
    aliases: { type: [String], default: [] },
    searchableText: { type: String, required: true, default: '' }
  },
  { timestamps: true }
);

RoomSchema.pre('validate', function (next) {
  try {
    const parts = [];
    if (this.number) parts.push(String(this.number));
    if (this.name) parts.push(String(this.name));
    if (this.type) parts.push(String(this.type));
    if (Array.isArray(this.aliases)) {
      for (const a of this.aliases) {
        if (a) parts.push(String(a));
      }
    }
    const lowered = parts
      .map((p) => String(p).toLowerCase().trim())
      .filter((p) => p.length > 0);
    this.searchableText = lowered.join(' ');
    next();
  } catch (err) {
    next(err);
  }
});

RoomSchema.index({ searchableText: 'text' });
RoomSchema.index({ building: 1, floor: 1, number: 1 }, { unique: true });

module.exports = mongoose.model('Room', RoomSchema);
