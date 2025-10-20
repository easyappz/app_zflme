import instance from './axios';

export async function listBuildings({ campusId, page = 1, limit = 20 } = {}) {
  const params = { page, limit };
  if (campusId) params.campusId = campusId;
  const res = await instance.get('/api/buildings', { params });
  return res.data;
}

export async function getBuildingById(id) {
  const res = await instance.get(`/api/buildings/${id}`);
  return res.data;
}

export async function getBuildingFloors(id) {
  const res = await instance.get(`/api/buildings/${id}/floors`);
  return res.data;
}

export async function getBuildingRooms(id, { floor, page = 1, limit = 20 } = {}) {
  const params = { page, limit };
  if (typeof floor === 'number') params.floor = floor;
  const res = await instance.get(`/api/buildings/${id}/rooms`, { params });
  return res.data;
}
