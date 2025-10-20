import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { listCampuses } from '../../api/campuses';
import { listBuildings } from '../../api/buildings';
import { listRooms } from '../../api/rooms';
import './RoomsSearch.css';

function normalizeString(s) {
  const str = (s || '').toString().trim().toLowerCase();
  const parts = [];
  let current = '';
  for (let i = 0; i < str.length; i += 1) {
    const ch = str[i];
    if (ch === ' ') {
      if (current) { parts.push(current); current = ''; }
    } else {
      current += ch;
    }
  }
  if (current) parts.push(current);
  return parts.join(' ');
}

function highlightText(text, query) {
  const TS = Date.now();
  const t = (text || '').toString();
  const q = normalizeString(query);
  if (!q) return <span data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-highlight-full`}>{t}</span>;
  const lower = t.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return <span data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-highlight-no`}>{t}</span>;
  const before = t.substring(0, idx);
  const match = t.substring(idx, idx + q.length);
  const after = t.substring(idx + q.length);
  return (
    <span data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-highlight-wrap`}>
      <span data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-highlight-before`}>{before}</span>
      <span data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-highlight-match`} className="rs-match">{match}</span>
      <span data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-highlight-after`}>{after}</span>
    </span>
  );
}

function RoomsSearch() {
  const TS = Date.now();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [campusId, setCampusId] = useState('');
  const [buildingId, setBuildingId] = useState('');

  useEffect(() => {
    // Reset building when campus changes
    setBuildingId('');
  }, [campusId]);

  const { data: campusesData } = useQuery({
    queryKey: ['campuses', { limit: 100 }],
    queryFn: () => listCampuses({ page: 1, limit: 100 }),
  });

  const { data: buildingsData } = useQuery({
    queryKey: ['buildings', { campusId, limit: 200 }],
    queryFn: () => listBuildings({ campusId: campusId || undefined, page: 1, limit: 200 }),
  });

  const buildings = buildingsData?.items || [];
  const buildingMap = useMemo(() => {
    const map = {};
    buildings.forEach((b) => { map[b._id] = b; });
    return map;
  }, [buildings]);

  const { data: roomsData, isLoading } = useQuery({
    queryKey: ['rooms', { query, buildingId }],
    queryFn: () => listRooms({ query: normalizeString(query) || undefined, buildingId: buildingId || undefined, page: 1, limit: 500 }),
  });

  const filteredRooms = useMemo(() => {
    const items = roomsData?.items || [];
    if (!campusId) return items;
    const campusBuildingIds = new Set(buildings.map((b) => b._id));
    return items.filter((r) => campusBuildingIds.has(r.buildingId));
  }, [roomsData, campusId, buildings]);

  const groupedByBuilding = useMemo(() => {
    const groups = {};
    filteredRooms.forEach((r) => {
      if (!groups[r.buildingId]) groups[r.buildingId] = [];
      groups[r.buildingId].push(r);
    });
    return groups;
  }, [filteredRooms]);

  const buildingIds = Object.keys(groupedByBuilding);

  return (
    <div data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-root`} className="rs-root">
      <div data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-head`} className="rs-head">
        <h1 data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-title`} className="rs-title">Поиск аудиторий</h1>
        <p data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-desc`} className="rs-desc">Введите номер или название аудитории, выберите кампус и здание, чтобы сузить результаты.</p>
      </div>

      <div data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-controls`} className="rs-controls">
        <div data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-input-wrap`} className="rs-input-wrap">
          <input
            data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-input`}
            type="text"
            className="rs-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Например: 101, Лаборатория"
          />
        </div>
        <div data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-filters`} className="rs-filters">
          <div data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-filter-campus`} className="rs-filter">
            <label data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-label-campus`} className="rs-label">Кампус</label>
            <select
              data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-select-campus`}
              className="rs-select"
              value={campusId}
              onChange={(e) => setCampusId(e.target.value)}
            >
              <option data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-option-campus-all`} value="">Все кампусы</option>
              {(campusesData?.items || []).map((c) => (
                <option data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-option-campus-${c._id}`} key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-filter-building`} className="rs-filter">
            <label data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-label-building`} className="rs-label">Здание</label>
            <select
              data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-select-building`}
              className="rs-select"
              value={buildingId}
              onChange={(e) => setBuildingId(e.target.value)}
            >
              <option data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-option-building-all`} value="">Все здания</option>
              {buildings.map((b) => (
                <option data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-option-building-${b._id}`} key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-results`} className="rs-results">
        {isLoading ? (
          <div data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-loading`} className="rs-empty">Загрузка...</div>
        ) : (!query ? (
          <div data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-enter`} className="rs-empty">Введите запрос, чтобы начать поиск</div>
        ) : (buildingIds.length === 0 ? (
          <div data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-no`} className="rs-empty">Ничего не найдено</div>
        ) : (
          buildingIds.map((bId) => {
            const building = buildingMap[bId];
            const rooms = groupedByBuilding[bId];
            return (
              <section data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-group-${bId}`} key={bId} className="rs-group">
                <div data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-group-head`} className="rs-group-head">
                  <div data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-group-info`} className="rs-group-info">
                    <h2 data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-group-title`} className="rs-group-title">{building?.name || 'Неизвестное здание'}</h2>
                    {building?.code ? (
                      <span data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-group-code`} className="rs-group-code">{building.code}</span>
                    ) : null}
                  </div>
                  <div data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-group-actions`} className="rs-group-actions">
                    <button
                      data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-btn-open`}
                      className="rs-btn"
                      onClick={() => navigate(`/buildings/${bId}`)}
                    >
                      Открыть здание
                    </button>
                    <button
                      data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-btn-map`}
                      className="rs-btn secondary"
                      onClick={() => navigate('/map', { state: { focusBuildingId: bId } })}
                    >
                      На карте
                    </button>
                  </div>
                </div>
                <ul data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-room-list`} className="rs-room-list">
                  {rooms.map((r) => (
                    <li data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-room-${r._id}`} key={r._id} className="rs-room">
                      <div data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-room-left`} className="rs-room-left">
                        <div data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-room-number`} className="rs-room-number">{highlightText(r.number || '', query)}</div>
                        {r.name ? (
                          <div data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-room-name`} className="rs-room-name">{highlightText(r.name || '', query)}</div>
                        ) : null}
                      </div>
                      <div data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-room-right`} className="rs-room-right">
                        <span data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.js-room-floor`} className="rs-room-floor">этаж {r.floor}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })
        ))}
      </div>
    </div>
  );
}

export default RoomsSearch;
