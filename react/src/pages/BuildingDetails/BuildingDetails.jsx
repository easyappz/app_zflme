import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getBuilding, getBuildingFloors, getBuildingRooms, getBuildingFloorPlans } from '../../api/buildings';
import { buildRoute } from '../../api/navigation';
import './BuildingDetails.css';

function usePanZoom() {
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const last = useRef({ x: 0, y: 0 });

  const onWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const next = Math.min(3, Math.max(0.5, scale + delta));
    setScale(next);
  }, [scale]);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    start.current = { x: e.clientX, y: e.clientY };
    last.current = { x: tx, y: ty };
  }, [tx, ty]);

  const onMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    setTx(last.current.x + dx);
    setTy(last.current.y + dy);
  }, []);

  const endDrag = useCallback(() => {
    dragging.current = false;
  }, []);

  return { scale, tx, ty, onWheel, onMouseDown, onMouseMove, endDrag, setScale, setTx, setTy };
}

const BuildingDetails = () => {
  const TS = Date.now();
  const { id } = useParams();
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [fromRoomId, setFromRoomId] = useState('');
  const [toRoomId, setToRoomId] = useState('');
  const [routeSteps, setRouteSteps] = useState([]);
  const [routeDistance, setRouteDistance] = useState(0);

  const panZoom = usePanZoom();

  const { data: building, isLoading: isBuildingLoading, error: buildingError } = useQuery({
    queryKey: ['building', id],
    queryFn: () => getBuilding(id)
  });

  const { data: floorsData, isLoading: isFloorsLoading } = useQuery({
    queryKey: ['building-floors', id],
    queryFn: () => getBuildingFloors(id)
  });

  const { data: plansData } = useQuery({
    queryKey: ['building-floor-plans', id],
    queryFn: () => getBuildingFloorPlans(id)
  });

  const floors = useMemo(() => floorsData?.floors || [], [floorsData]);

  useEffect(() => {
    if (floors.length && (selectedFloor === null || !floors.includes(selectedFloor))) {
      setSelectedFloor(floors[0]);
    }
  }, [floors, selectedFloor]);

  const { data: roomsData, isLoading: isRoomsLoading } = useQuery({
    queryKey: ['building-rooms', id, selectedFloor],
    queryFn: () => getBuildingRooms(id, { floor: selectedFloor, limit: 200 }),
    enabled: typeof selectedFloor === 'number'
  });

  const rooms = useMemo(() => roomsData?.items || [], [roomsData]);

  const floorPlanUrl = useMemo(() => {
    const items = plansData?.items || [];
    const rec = items.find((p) => p.level === selectedFloor);
    return rec?.planImageUrl || '';
  }, [plansData, selectedFloor]);

  const routeMutation = useMutation({
    mutationFn: (payload) => buildRoute(payload)
  });

  const handleBuildRoute = async () => {
    if (!fromRoomId || !toRoomId) return;
    try {
      const result = await routeMutation.mutateAsync({
        buildingId: id,
        from: { roomId: fromRoomId },
        to: { roomId: toRoomId }
      });
      setRouteSteps(result.steps || []);
      setRouteDistance(result.distance || 0);
    } catch (e) {
      setRouteSteps([]);
      setRouteDistance(0);
    }
  };

  const resetRoute = () => {
    setFromRoomId('');
    setToRoomId('');
    setRouteSteps([]);
    setRouteDistance(0);
  };

  if (isBuildingLoading || isFloorsLoading) {
    return (
      <div className="bd__loading" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-loading`}>
        Загрузка...
      </div>
    );
  }

  if (buildingError) {
    return (
      <div className="bd__error" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-error`}>
        Произошла ошибка при загрузке здания
      </div>
    );
  }

  return (
    <div className="bd" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-root`}>
      <section className="bd__header" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-header`}>
        <h1 className="bd__title" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-title`}>
          {building?.name || 'Здание'}{building?.code ? ` — ${building.code}` : ''}
        </h1>
        <p className="bd__subtitle" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-subtitle`}>
          Информация о здании и навигация внутри
        </p>
      </section>

      <section className="bd__floors" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-floors`}>
        <div className="bd__floors-list" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-floors-list`}>
          {floors.map((f) => (
            <button
              key={f}
              data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-floor-btn-${f}`}
              className={f === selectedFloor ? 'bd__floor-btn bd__floor-btn--active' : 'bd__floor-btn'}
              onClick={() => setSelectedFloor(f)}
              type="button"
            >
              Этаж {f}
            </button>
          ))}
        </div>
      </section>

      <section className="bd__content" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-content`}>
        <div className="bd__plan" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-plan`}>
          {floorPlanUrl ? (
            <div
              className="plan__viewport"
              onWheel={panZoom.onWheel}
              onMouseDown={panZoom.onMouseDown}
              onMouseMove={panZoom.onMouseMove}
              onMouseUp={panZoom.endDrag}
              onMouseLeave={panZoom.endDrag}
              data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-plan-viewport`}
            >
              <div
                className="plan__content"
                style={{ transform: `translate(${panZoom.tx}px, ${panZoom.ty}px) scale(${panZoom.scale})` }}
                data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-plan-content`}
              >
                <img
                  src={floorPlanUrl}
                  alt={`План этажа ${selectedFloor}`}
                  className="plan__image"
                  draggable={false}
                  data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-plan-image`}
                />
              </div>
              <div className="plan__controls" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-plan-controls`}>
                <button type="button" className="plan__ctrl" onClick={() => panZoom.setScale((s) => Math.min(3, s + 0.1))} data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-plan-zoom-in`}>
                  +
                </button>
                <button type="button" className="plan__ctrl" onClick={() => panZoom.setScale((s) => Math.max(0.5, s - 0.1))} data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-plan-zoom-out`}>
                  −
                </button>
                <button type="button" className="plan__ctrl" onClick={() => { panZoom.setScale(1); panZoom.setTx(0); panZoom.setTy(0); }} data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-plan-reset`}>
                  Сброс
                </button>
              </div>
            </div>
          ) : (
            <div className="plan__placeholder" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-plan-placeholder`}>
              Схема этажа недоступна
            </div>
          )}
        </div>

        <div className="bd__sidebar" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-sidebar`}>
          <div className="bd__route" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-route`}>
            <h2 className="bd__section-title" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-route-title`}>
              Маршрут внутри здания
            </h2>
            <div className="route__form" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-route-form`}>
              <label className="route__label" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-route-from-label`}>
                Откуда
                <select
                  className="route__select"
                  value={fromRoomId}
                  onChange={(e) => setFromRoomId(e.target.value)}
                  data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-route-from-select`}
                >
                  <option value="" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-route-from-opt-empty`}>Выберите аудиторию</option>
                  {rooms.map((r) => (
                    <option key={r._id} value={r._id} data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-route-from-opt-${r._id}`}>
                      {r.number ? `#${r.number}` : r.name || 'Аудитория'} — этаж {r.floor}
                    </option>
                  ))}
                </select>
              </label>
              <label className="route__label" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-route-to-label`}>
                Куда
                <select
                  className="route__select"
                  value={toRoomId}
                  onChange={(e) => setToRoomId(e.target.value)}
                  data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-route-to-select`}
                >
                  <option value="" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-route-to-opt-empty`}>Выберите аудиторию</option>
                  {rooms.map((r) => (
                    <option key={r._id} value={r._id} data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-route-to-opt-${r._id}`}>
                      {r.number ? `#${r.number}` : r.name || 'Аудитория'} — этаж {r.floor}
                    </option>
                  ))}
                </select>
              </label>
              <div className="route__actions" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-route-actions`}>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={handleBuildRoute}
                  disabled={!fromRoomId || !toRoomId || routeMutation.isLoading}
                  data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-route-build-btn`}
                >
                  {routeMutation.isLoading ? 'Строим...' : 'Проложить маршрут'}
                </button>
                <button type="button" className="btn" onClick={resetRoute} data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-route-reset-btn`}>
                  Сбросить
                </button>
              </div>
              {routeSteps.length > 0 && (
                <div className="route__result" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-route-result`}>
                  <p className="route__distance" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-route-distance`}>
                    Длина маршрута: {routeDistance.toFixed(1)} м
                  </p>
                  <ul className="route__steps" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-route-steps`}>
                    {routeSteps.map((s, idx) => (
                      <li key={`${s.floor}-${idx}`} className="route__step" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-route-step-${idx}`}>
                        Этаж {s.floor}: пройдите {s.segmentDistance.toFixed(1)} м
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="bd__rooms" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-rooms`}>
            <h2 className="bd__section-title" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-rooms-title`}>
              Аудитории этажа {selectedFloor}
            </h2>
            {isRoomsLoading ? (
              <div className="bd__loading" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-rooms-loading`}>
                Загрузка аудиторий...
              </div>
            ) : (
              <ul className="rooms__list" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-rooms-list`}>
                {rooms.map((r) => {
                  const isFrom = r._id === fromRoomId;
                  const isTo = r._id === toRoomId;
                  return (
                    <li
                      key={r._id}
                      className={isFrom || isTo ? 'rooms__item rooms__item--active' : 'rooms__item'}
                      data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-room-item-${r._id}`}
                    >
                      <div className="room__main" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-room-main-${r._id}`}>
                        <span className="room__number" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-room-number-${r._id}`}>{r.number ? `#${r.number}` : r.name || 'Аудитория'}</span>
                        <span className="room__floor" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-room-floor-${r._id}`}>этаж {r.floor}</span>
                      </div>
                      <div className="room__actions" data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-room-actions-${r._id}`}>
                        <button
                          type="button"
                          className={isFrom ? 'btn btn--small btn--primary' : 'btn btn--small'}
                          onClick={() => setFromRoomId(r._id)}
                          data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-room-set-from-${r._id}`}
                        >
                          Отсюда
                        </button>
                        <button
                          type="button"
                          className={isTo ? 'btn btn--small btn--primary' : 'btn btn--small'}
                          onClick={() => setToRoomId(r._id)}
                          data-easytag={`${TS}-src/pages/BuildingDetails/BuildingDetails.jsx-room-set-to-${r._id}`}
                        >
                          Сюда
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BuildingDetails;
