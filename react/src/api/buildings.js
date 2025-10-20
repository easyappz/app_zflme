import instance from './axios';

export async function listBuildings(params = {}) {
  const res = await instance.get('/api/buildings', { params });
  return res.data; // { page, limit, total, items: [...] }
}

export async function getBuilding(id) {
  const res = await instance.get(`/api/buildings/${id}`);
  return res.data; // building object
}

export async function getBuildingFloors(id) {
  const res = await instance.get(`/api/buildings/${id}/floors`);
  return res.data; // { buildingId, floors: [...] }
}

export async function listBuildingRooms({ id, floor, page, limit } = {}) {
  const res = await instance.get(`/api/buildings/${id}/rooms`, { params: { floor, page, limit } });
  return res.data; // { page, limit, total, items: [...] }
}

export default { listBuildings, getBuilding, getBuildingFloors, listBuildingRooms };
