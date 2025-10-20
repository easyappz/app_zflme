import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBuilding, listBuildingRooms } from '../../api/buildings';
import './BuildingDetails.css';

function BuildingDetails() {
  const TS = Date.now();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: building, isLoading: isBuildingLoading } = useQuery({
    queryKey: ['building', id],
    queryFn: () => getBuilding(id),
    enabled: !!id,
  });

  const { data: roomsData, isLoading: isRoomsLoading } = useQuery({
    queryKey: ['building-rooms', id],
    queryFn: () => listBuildingRooms({ id, page: 1, limit: 50 }),
    enabled: !!id,
  });

  return (
    <div data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.js-root`} className="bd-root">
      <div data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.js-header`} className="bd-header">
        <button data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.js-back`} className="bd-back" onClick={() => navigate(-1)}>Назад</button>
        <h1 data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.js-title`} className="bd-title">Информация о здании</h1>
      </div>

      {isBuildingLoading ? (
        <div data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.js-loading-building`} className="bd-info">Загрузка здания...</div>
      ) : building ? (
        <div data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.js-info`} className="bd-info">
          <div data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.js-row-name`} className="bd-row"><span data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.js-label-name`} className="bd-label">Название:</span> <span data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.js-value-name`} className="bd-value">{building.name}</span></div>
          <div data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.js-row-code`} className="bd-row"><span data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.js-label-code`} className="bd-label">Код:</span> <span data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.js-value-code`} className="bd-value">{building.code}</span></div>
        </div>
      ) : (
        <div data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.js-no-building`} className="bd-info">Здание не найдено</div>
      )}

      <h2 data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.js-rooms-title`} className="bd-subtitle">Аудитории здания</h2>
      {isRoomsLoading ? (
        <div data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.js-loading-rooms`} className="bd-info">Загрузка аудиторий...</div>
      ) : (
        <ul data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.js-rooms`} className="bd-rooms">
          {(roomsData?.items || []).map((r) => (
            <li data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.js-room-${Math.random()}`} key={r._id} className="bd-room">
              <span data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.js-room-number`} className="bd-room-number">{r.number}</span>
              <span data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.js-room-floor`} className="bd-room-floor">этаж {r.floor}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BuildingDetails;
