import instance from './axios';

export async function listRooms({ buildingId, floor, query, page = 1, limit = 20 } = {}) {
  const params = { page, limit };
  if (buildingId) params.buildingId = buildingId;
  if (typeof floor === 'number') params.floor = floor;
  if (query) params.query = query;
  const res = await instance.get('/api/rooms', { params });
  return res.data;
}
