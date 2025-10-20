import instance from './axios';

export async function listCampuses(params = {}) {
  const res = await instance.get('/api/campuses', { params });
  return res.data; // { page, limit, total, items: [...] }
}

export default { listCampuses };
