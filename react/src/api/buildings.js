import instance from './axios';

export async function listBuildings(params = {}) {
  const res = await instance.get('/api/buildings', { params });
  return res.data;
}

export async function getBuilding(id) {
  const res = await instance.get(`/api/buildings/${id}`);
  return res.data;
}

export async function getBuildingFloors(id) {
  const res = await instance.get(`/api/buildings/${id}/floors`);
  return res.data;
}

export async function getBuildingFloorPlans(id) {
  const res = await instance.get(`/api/buildings/${id}/floor-plans`);
  return res.data;
}

export async function getBuildingRooms(id, params = {}) {
  const res = await instance.get(`/api/buildings/${id}/rooms`, { params });
  return res.data;
}

export default {
  listBuildings,
  getBuilding,
  getBuildingFloors,
  getBuildingFloorPlans,
  getBuildingRooms,
};
