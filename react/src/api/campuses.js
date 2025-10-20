import instance from './axios';

export async function listCampuses({ page = 1, limit = 20 } = {}) {
  const res = await instance.get('/api/campuses', { params: { page, limit } });
  return res.data;
}

export async function getCampusById(id) {
  const res = await instance.get(`/api/campuses/${id}`);
  return res.data;
}
