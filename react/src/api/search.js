import instance from './axios';

export async function unifiedSearch(params = {}) {
  const res = await instance.get('/api/search', { params });
  return res.data; // { query, campuses, buildings, rooms }
}

export default { unifiedSearch };
