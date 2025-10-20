import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBuildingById, getBuildingFloors, getBuildingRooms } from '../../api/buildings';
import './BuildingDetails.css';

const BuildingDetails = () => {
  const TS = Date.now();
  const { id } = useParams();
  const [floor, setFloor] = useState(null);

  const { data: building, isLoading: loadingBuilding, error: errorBuilding } = useQuery({
    queryKey: ['building', id],
    queryFn: () => getBuildingById(id)
  });

  const { data: floors, isLoading: loadingFloors } = useQuery({
    queryKey: ['building-floors', id],
    queryFn: () => getBuildingFloors(id)
  });

  const floorOptions = useMemo(() => {
    const arr = (floors && floors.floors) ? floors.floors : [];
    return arr;
  }, [floors]);

  const selectedFloor = floor !== null ? floor : (floorOptions.length ? floorOptions[0] : null);

  const { data: rooms, isLoading: loadingRooms } = useQuery({
    queryKey: ['building-rooms', id, selectedFloor],
    queryFn: () => getBuildingRooms(id, { floor: selectedFloor, page: 1, limit: 50 }),
    enabled: selectedFloor !== null
  });

  return (
    <section className="building" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-section`}>
      {loadingBuilding && (
        <div className="panel" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-loading`}>Загрузка...</div>
      )}
      {errorBuilding && (
        <div className="panel error" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-error`}>Не удалось загрузить здание</div>
      )}

      {building && (
        <div className="panel" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-info`}>
          <h1 data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-title`}>{building.name}</h1>
          <p className="muted" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-sub`}>Код: {building.code}</p>
        </div>
      )}

      <div className="panel" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-floors`}>
        <label htmlFor="floor" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-floor-label`}>Этаж</label>
        <select
          id="floor"
          className="select"
          value={selectedFloor ?? ''}
          onChange={(e) => setFloor(Number(e.target.value))}
          disabled={loadingFloors || !floorOptions.length}
          data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-floor-select`}
        >
          {floorOptions.map((f) => (
            <option key={f} value={f} data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-floor-option`}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div className="panel" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-rooms`}>
        <h3 data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-rooms-title`}>Аудитории</h3>
        {loadingRooms && (
          <div className="muted" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-rooms-loading`}>Загрузка аудиторий...</div>
        )}
        {rooms && (
          <ul className="list" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-rooms-list`}>
            {(rooms.items || []).map((r) => (
              <li key={r._id} className="list-item" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-room-item`}>
                <span data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-room-title`}>{r.name || 'Аудитория'} — {r.number}</span>
                <small className="muted" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-room-sub`}>Этаж: {r.floor}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default BuildingDetails;
