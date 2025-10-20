import instance from './axios';

export async function getBuilding(id) {
  const res = await instance.get(`/api/buildings/${id}`);
  return res.data;
}

export async function getBuildingFloors(id) {
  const res = await instance.get(`/api/buildings/${id}/floors`);
  return res.data; // { buildingId, floors: number[] }
}

export async function getBuildingRooms(id, params = {}) {
  const res = await instance.get(`/api/buildings/${id}/rooms`, { params });
  return res.data; // { page, limit, total, items }
}

export async function getBuildingFloorPlans(id) {
  const res = await instance.get(`/api/buildings/${id}/floor-plans`);
  return res.data; // { buildingId, items: [{ level, planImageUrl, bbox }] }
}

export default { getBuilding, getBuildingFloors, getBuildingRooms, getBuildingFloorPlans };
