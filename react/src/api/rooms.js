import instance from './axios';

export async function listRooms(params = {}) {
  const res = await instance.get('/api/rooms', { params });
  return res.data; // { page, limit, total, items: [...] }
}

export default { listRooms };
