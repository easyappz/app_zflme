import instance from './axios';

// API: GET /api/buildings?campusId
export async function getBuildingsByCampus(params = { campusId: undefined, page: 1, limit: 100 }) {
  const res = await instance.get('/api/buildings', { params });
  return res.data;
}

export default { getBuildingsByCampus };
