'use strict';

const dijkstra = require('dijkstrajs');
const Building = require('@src/models/Building');
const Room = require('@src/models/Room');
const NavigationNode = require('@src/models/NavigationNode');
const NavigationEdge = require('@src/models/NavigationEdge');

function distance(a, b) {
  const [x1, y1] = a;
  const [x2, y2] = b;
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

async function resolveEndpoint(buildingId, endpoint) {
  if (!endpoint) return null;
  if (endpoint.roomId) {
    const room = await Room.findOne({ _id: endpoint.roomId, buildingId }).lean();
    if (!room) {
      const err = new Error('Room for endpoint not found in the specified building');
      err.status = 404;
      err.details = { roomId: endpoint.roomId, buildingId };
      throw err;
    }
    if (room.nodeId) {
      const node = await NavigationNode.findById(room.nodeId).lean();
      if (node) return node;
    }
    // Fallback: choose nearest node to room point
    const nodes = await NavigationNode.find({ buildingId }).lean();
    if (!nodes.length) {
      const err = new Error('No navigation nodes available for building');
      err.status = 404;
      err.details = { buildingId };
      throw err;
    }
    let nearest = nodes[0];
    let best = distance(room.point, nodes[0].point);
    for (let i = 1; i < nodes.length; i += 1) {
      const d = distance(room.point, nodes[i].point);
      if (d < best) {
        best = d;
        nearest = nodes[i];
      }
    }
    return nearest;
  }
  if (Array.isArray(endpoint.point)) {
    const nodes = await NavigationNode.find({ buildingId }).lean();
    if (!nodes.length) {
      const err = new Error('No navigation nodes available for building');
      err.status = 404;
      err.details = { buildingId };
      throw err;
    }
    let nearest = nodes[0];
    let best = distance(endpoint.point, nodes[0].point);
    for (let i = 1; i < nodes.length; i += 1) {
      const d = distance(endpoint.point, nodes[i].point);
      if (d < best) {
        best = d;
        nearest = nodes[i];
      }
    }
    return nearest;
  }
  const err = new Error('Invalid endpoint data: provide roomId or point');
  err.status = 400;
  err.details = { endpoint };
  throw err;
}

async function buildGraph(buildingId) {
  const [nodes, edges] = await Promise.all([
    NavigationNode.find({ buildingId }).lean(),
    NavigationEdge.find({ buildingId }).lean()
  ]);
  if (!nodes.length) {
    const err = new Error('No navigation nodes found for building');
    err.status = 404;
    err.details = { buildingId };
    throw err;
  }
  if (!edges.length) {
    const err = new Error('No navigation edges found for building');
    err.status = 404;
    err.details = { buildingId };
    throw err;
  }

  const nodeById = new Map(nodes.map((n) => [String(n._id), n]));
  const graph = {};
  nodes.forEach((n) => {
    graph[String(n._id)] = {};
  });

  edges.forEach((e) => {
    const fromId = String(e.from);
    const toId = String(e.to);
    const fromNode = nodeById.get(fromId);
    const toNode = nodeById.get(toId);
    if (!fromNode || !toNode) return; // skip invalid edges silently
    const w = typeof e.weight === 'number' ? e.weight : distance(fromNode.point, toNode.point);
    graph[fromId][toId] = Math.max(w, 0.000001);
    if (e.bidirectional) {
      graph[toId][fromId] = Math.max(w, 0.000001);
    }
  });

  return { graph, nodeById };
}

async function buildRoute(req, res) {
  try {
    const { buildingId, from, to } = req.body || {};

    if (!buildingId) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'buildingId is required',
        details: { body: req.body }
      });
    }

    const building = await Building.findById(buildingId).lean();
    if (!building) {
      return res.status(404).json({
        error: 'NotFound',
        message: `Building ${buildingId} not found`,
        details: { buildingId }
      });
    }

    const startNode = await resolveEndpoint(buildingId, from);
    const endNode = await resolveEndpoint(buildingId, to);

    const { graph, nodeById } = await buildGraph(buildingId);

    const startId = String(startNode._id);
    const endId = String(endNode._id);

    let pathNodeIds;
    try {
      pathNodeIds = dijkstra.find_path(graph, startId, endId);
    } catch (algoError) {
      return res.status(404).json({
        error: 'RouteNotFound',
        message: 'No path could be found between points',
        details: { startId, endId, reason: algoError.message }
      });
    }

    const steps = [];
    let totalDistance = 0;
    for (let i = 0; i < pathNodeIds.length - 1; i += 1) {
      const aId = pathNodeIds[i];
      const bId = pathNodeIds[i + 1];
      const a = nodeById.get(aId);
      const b = nodeById.get(bId);
      const seg = distance(a.point, b.point);
      totalDistance += seg;
      steps.push({ floor: a.floor, from: a.point, to: b.point, segmentDistance: seg });
    }

    const geometry = pathNodeIds.map((id) => nodeById.get(id).point);

    res.status(200).json({ distance: totalDistance, steps, geometry });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: error.name || 'BuildRouteError',
      message: error.message,
      details: Object.assign({}, error.details || {}, { stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined })
    });
  }
}

module.exports = { buildRoute };
