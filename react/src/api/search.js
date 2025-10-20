import instance from './axios';

export async function searchAll({ q, campusId, buildingId } = {}) {
  const params = {};
  if (q) params.q = q;
  if (campusId) params.campusId = campusId;
  if (buildingId) params.buildingId = buildingId;
  const res = await instance.get('/api/search', { params });
  return res.data;
}
