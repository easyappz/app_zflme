'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { normalizeForSearch } = require('@src/utils/text');

const RoomSchema = new Schema(
  {
    buildingId: { type: Schema.Types.ObjectId, ref: 'Building', required: true, index: true },
    name: { type: String, trim: true },
    number: { type: String, trim: true },
    floor: { type: Number, required: true, index: true },
    point: { type: [Number], default: [0, 0] }, // [lng, lat]
    nodeId: { type: Schema.Types.ObjectId, ref: 'NavigationNode' },
    searchableText: { type: String, index: true }
  },
  { timestamps: true }
);

RoomSchema.pre('save', function nextSave(next) {
  const base = [this.name, this.number, typeof this.floor === 'number' ? `floor ${this.floor}` : '']
    .filter(Boolean)
    .join(' ');
  this.searchableText = normalizeForSearch(base);
  next();
});

module.exports = mongoose.model('Room', RoomSchema);
