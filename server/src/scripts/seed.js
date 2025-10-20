'use strict';

require('module-alias/register');

const mongoose = require('mongoose');

const Campus = require('@src/models/Campus');
const Building = require('@src/models/Building');
const Floor = require('@src/models/Floor');
const Room = require('@src/models/Room');
const Edge = require('@src/models/Edge');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[seed] Connected to MongoDB');
  } catch (error) {
    console.error('[seed] MongoDB connection error:', error.message);
    process.exit(1);
  }

  try {
    // Clear collections to keep seed idempotent
    await Promise.all([
      Edge.deleteMany({}),
      Room.deleteMany({}),
      Floor.deleteMany({}),
      Building.deleteMany({}),
      Campus.deleteMany({})
    ]);

    // Campuses
    const campuses = await Campus.insertMany([
      {
        name: 'Moscow Campus',
        code: 'MSC',
        center: [37.618423, 55.751244],
        bounds: {
          type: 'Polygon',
          coordinates: [
            [
              [37.56, 55.72],
              [37.70, 55.72],
              [37.70, 55.79],
              [37.56, 55.79],
              [37.56, 55.72]
            ]
          ]
        },
        city: 'Moscow',
        description: 'Central campus in Moscow.'
      },
      {
        name: 'St Petersburg Campus',
        code: 'SPB',
        center: [30.314997, 59.934280],
        bounds: {
          type: 'Polygon',
          coordinates: [
            [
              [30.25, 59.90],
              [30.40, 59.90],
              [30.40, 59.97],
              [30.25, 59.97],
              [30.25, 59.90]
            ]
          ]
        },
        city: 'Saint Petersburg',
        description: 'Northern campus in St Petersburg.'
      }
    ]);

    const moscowCampus = campuses.find((c) => c.code === 'MSC');

    // Buildings
    const buildings = await Building.insertMany([
      {
        campus: moscowCampus._id,
        name: 'Main Building',
        code: 'GZ',
        address: 'Myasnitskaya St, 20',
        location: [37.6517, 55.7652],
        entrances: [
          { name: 'Main Entrance', location: [37.6515, 55.7653] },
          { name: 'Side Entrance', location: [37.6519, 55.7651] }
        ],
        floors: [1, 2],
        description: 'Primary academic building.'
      },
      {
        campus: moscowCampus._id,
        name: 'University Library',
        code: 'LIB',
        address: 'Pokrovsky Blvd, 11',
        location: [37.6455, 55.7578],
        entrances: [
          { name: 'Library Entrance', location: [37.6453, 55.7579] }
        ],
        floors: [1, 2],
        description: 'Main library building.'
      }
    ]);

    const gz = buildings.find((b) => b.code === 'GZ');
    const lib = buildings.find((b) => b.code === 'LIB');

    // Floors
    const floors = await Floor.insertMany([
      {
        building: gz._id,
        level: 1,
        planImageUrl: 'https://example.com/plans/gz-floor-1.png',
        bbox: {
          type: 'Polygon',
          coordinates: [
            [
              [37.6512, 55.7649],
              [37.6522, 55.7649],
              [37.6522, 55.7655],
              [37.6512, 55.7655],
              [37.6512, 55.7649]
            ]
          ]
        }
      },
      {
        building: gz._id,
        level: 2,
        planImageUrl: 'https://example.com/plans/gz-floor-2.png',
        bbox: {
          type: 'Polygon',
          coordinates: [
            [
              [37.6512, 55.7649],
              [37.6522, 55.7649],
              [37.6522, 55.7655],
              [37.6512, 55.7655],
              [37.6512, 55.7649]
            ]
          ]
        }
      },
      {
        building: lib._id,
        level: 1,
        planImageUrl: 'https://example.com/plans/lib-floor-1.png',
        bbox: {
          type: 'Polygon',
          coordinates: [
            [
              [37.6451, 55.7576],
              [37.6459, 55.7576],
              [37.6459, 55.7580],
              [37.6451, 55.7580],
              [37.6451, 55.7576]
            ]
          ]
        }
      }
    ]);

    // Rooms
    const rooms = await Room.insertMany([
      {
        building: gz._id,
        floor: 1,
        number: '101',
        name: 'Auditorium 101',
        type: 'auditorium',
        centroid: [37.6516, 55.7652],
        aliases: ['A101']
      },
      {
        building: gz._id,
        floor: 1,
        number: '102',
        name: 'Seminar Room 102',
        type: 'seminar',
        centroid: [37.6517, 55.76525],
        aliases: ['SR102']
      },
      {
        building: gz._id,
        floor: 2,
        number: '201',
        name: 'Lecture Hall 201',
        type: 'lecture',
        centroid: [37.65165, 55.7653],
        aliases: ['LH201']
      },
      {
        building: lib._id,
        floor: 1,
        number: 'L101',
        name: 'Reading Room',
        type: 'reading',
        centroid: [37.6455, 55.7578],
        aliases: ['RR1']
      }
    ]);

    const r101 = rooms.find((r) => r.number === '101');
    const r102 = rooms.find((r) => r.number === '102');
    const r201 = rooms.find((r) => r.number === '201');

    // Basic navigation edges (GZ building)
    await Edge.insertMany([
      // Corridor connection between rooms on floor 1
      {
        building: gz._id,
        floor: 1,
        from: { room: r101._id },
        to: { point: [37.65155, 55.76522] },
        weight: 5
      },
      {
        building: gz._id,
        floor: 1,
        from: { point: [37.65155, 55.76522] },
        to: { room: r102._id },
        weight: 5
      },
      // Stairs node connecting floor 1 and 2 via a shared point (abstract)
      {
        building: gz._id,
        floor: 1,
        from: { point: [37.65160, 55.76520] },
        to: { point: [37.65160, 55.76525] },
        weight: 8
      },
      {
        building: gz._id,
        floor: 2,
        from: { point: [37.65160, 55.76525] },
        to: { room: r201._id },
        weight: 6
      }
    ]);

    console.log('[seed] Seed completed successfully');
  } catch (error) {
    console.error('[seed] Failed during seeding:', error.message);
    console.error(error);
    process.exit(1);
  }

  try {
    await mongoose.connection.close();
    console.log('[seed] MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('[seed] Error closing MongoDB connection:', error.message);
    process.exit(1);
  }
})();
