import instance from './axios';

export async function buildRoute({ buildingId, from, to }) {
  const payload = { buildingId, from, to };
  const res = await instance.post('/api/navigation/route', payload);
  return res.data;
}
