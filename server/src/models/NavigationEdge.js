'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const NavigationEdgeSchema = new Schema(
  {
    buildingId: { type: Schema.Types.ObjectId, ref: 'Building', required: true, index: true },
    from: { type: Schema.Types.ObjectId, ref: 'NavigationNode', required: true, index: true },
    to: { type: Schema.Types.ObjectId, ref: 'NavigationNode', required: true, index: true },
    weight: { type: Number },
    bidirectional: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('NavigationEdge', NavigationEdgeSchema);
