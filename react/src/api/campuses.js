import instance from './axios';

// API: GET /api/campuses
export async function getCampuses(params = { page: 1, limit: 100 }) {
  const res = await instance.get('/api/campuses', { params });
  return res.data;
}

export default { getCampuses };
