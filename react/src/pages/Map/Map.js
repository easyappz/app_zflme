import React, { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css';
import { useQuery } from '@tanstack/react-query';
import { getCampuses } from '../../api/campuses';
import { getBuildingsByCampus } from '../../api/buildings';

const EASYTAG = Date.now();

const LIGHT_RASTER_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors'
    }
  },
  layers: [
    { id: 'osm', type: 'raster', source: 'osm', minzoom: 0, maxzoom: 19 }
  ],
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
};

function MapPage() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const campusMarkersRef = useRef([]);
  const buildingMarkersRef = useRef([]);

  const [selectedCampusId, setSelectedCampusId] = useState(undefined);

  const { data: campusesData, isLoading: campusesLoading, isError: campusesError } = useQuery({
    queryKey: ['campuses', { page: 1, limit: 100 }],
    queryFn: () => getCampuses({ page: 1, limit: 100 })
  });

  const { data: buildingsData, isFetching: buildingsLoading } = useQuery({
    queryKey: ['buildingsByCampus', { campusId: selectedCampusId }],
    queryFn: () => getBuildingsByCampus({ campusId: selectedCampusId, page: 1, limit: 100 }),
    enabled: !!selectedCampusId
  });

  const campuses = useMemo(() => (campusesData?.items || []), [campusesData]);
  const buildings = useMemo(() => (buildingsData?.items || []), [buildingsData]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: LIGHT_RASTER_STYLE,
      center: [37.617, 55.755],
      zoom: 11,
      attributionControl: false,
      cooperativeGestures: true
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true, visualizePitch: true }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ customAttribution: 'Карта: © OpenStreetMap contributors' }), 'bottom-right');

    mapInstanceRef.current = map;

    return () => {
      try {
        campusMarkersRef.current.forEach(m => m.remove());
        buildingMarkersRef.current.forEach(m => m.remove());
      } catch (_) { }
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const clearMarkers = (listRef) => {
    listRef.current.forEach(m => {
      try { m.remove(); } catch (_) { }
    });
    listRef.current = [];
  };

  const fitToPoints = (points) => {
    const map = mapInstanceRef.current;
    if (!map || !points || points.length === 0) return;
    if (points.length === 1) {
      const [lng, lat] = points[0];
      map.easeTo({ center: [lng, lat], zoom: 14, duration: 800 });
      return;
    }
    const bounds = new maplibregl.LngLatBounds(points[0], points[0]);
    for (let i = 1; i < points.length; i += 1) bounds.extend(points[i]);
    map.fitBounds(bounds, { padding: { top: 80, right: 80, bottom: 80, left: 80 }, duration: 800, maxZoom: 16 });
  };

  const renderCampusMarkers = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    clearMarkers(campusMarkersRef);

    campuses.forEach(c => {
      if (!Array.isArray(c.center) || c.center.length !== 2) return;
      const el = document.createElement('div');
      el.className = 'marker campus';
      el.setAttribute('data-easytag', `${EASYTAG}-src/pages/Map/Map.js-marker-campus`);
      el.title = c.name || 'Кампус';
      el.textContent = c.code ? String(c.code).slice(0, 3).toUpperCase() : 'C';
      el.style.cursor = 'pointer';

      el.addEventListener('click', () => {
        setSelectedCampusId(c._id);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' }).setLngLat([c.center[0], c.center[1]]);
      marker.addTo(map);
      campusMarkersRef.current.push(marker);
    });

    const pts = campuses.map(c => c.center).filter(Boolean);
    if (pts.length) fitToPoints(pts);
  };

  const renderBuildingMarkers = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    clearMarkers(buildingMarkersRef);

    buildings.forEach(b => {
      if (!Array.isArray(b.center) || b.center.length !== 2) return;
      const el = document.createElement('div');
      el.className = 'marker building';
      el.setAttribute('data-easytag', `${EASYTAG}-src/pages/Map/Map.js-marker-building`);
      el.title = b.name || 'Здание';
      el.style.cursor = 'pointer';

      el.addEventListener('click', () => {
        const content = document.createElement('div');
        content.className = 'popup-content';
        content.setAttribute('data-easytag', `${EASYTAG}-src/pages/Map/Map.js-popup-content`);
        const title = document.createElement('h4');
        title.className = 'popup-title';
        title.setAttribute('data-easytag', `${EASYTAG}-src/pages/Map/Map.js-popup-title`);
        title.textContent = b.name || 'Здание';
        const sub = document.createElement('div');
        sub.className = 'popup-sub';
        sub.setAttribute('data-easytag', `${EASYTAG}-src/pages/Map/Map.js-popup-sub`);
        sub.textContent = b.code ? `Код: ${b.code}` : 'Адрес не указан';
        const actions = document.createElement('div');
        actions.className = 'popup-actions';
        actions.setAttribute('data-easytag', `${EASYTAG}-src/pages/Map/Map.js-popup-actions`);
        const link = document.createElement('a');
        link.setAttribute('data-easytag', `${EASYTAG}-src/pages/Map/Map.js-popup-link`);
        link.href = `/buildings/${b._id}`;
        link.textContent = 'Открыть страницу здания';
        actions.appendChild(link);
        content.appendChild(title);
        content.appendChild(sub);
        content.appendChild(actions);

        const popup = new maplibregl.Popup({ closeButton: true, closeOnClick: true })
          .setLngLat([b.center[0], b.center[1]])
          .setDOMContent(content)
          .addTo(map);

        // Optional: navigate without full reload if helper present
        link.addEventListener('click', (e) => {
          if (window.__easyNavigate) {
            e.preventDefault();
            window.__easyNavigate(`/buildings/${b._id}`);
            popup.remove();
          }
        });
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' }).setLngLat([b.center[0], b.center[1]]);
      marker.addTo(map);
      buildingMarkersRef.current.push(marker);
    });

    const pts = buildings.map(b => b.center).filter(Boolean);
    if (pts.length) fitToPoints(pts);
  };

  useEffect(() => {
    if (!campusesLoading && !campusesError && campuses.length) {
      renderCampusMarkers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campusesLoading, campusesError, campuses]);

  useEffect(() => {
    if (selectedCampusId && !buildingsLoading) {
      renderBuildingMarkers();
    }
    if (!selectedCampusId) {
      clearMarkers(buildingMarkersRef);
      renderCampusMarkers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCampusId, buildingsLoading, buildings]);

  const activeObjectsCount = useMemo(() => {
    if (selectedCampusId) return buildings.length;
    return campuses.length;
  }, [selectedCampusId, buildings.length, campuses.length]);

  return (
    <section data-easytag={`${EASYTAG}-src/pages/Map/Map.js-root`} className="map-page-root">
      <div data-easytag={`${EASYTAG}-src/pages/Map/Map.js-toolbar`} className="map-toolbar">
        <div data-easytag={`${EASYTAG}-src/pages/Map/Map.js-toolbar-titleWrap`} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span data-easytag={`${EASYTAG}-src/pages/Map/Map.js-toolbar-title`} className="title">Карта кампусов</span>
          <span data-easytag={`${EASYTAG}-src/pages/Map/Map.js-toolbar-muted`} className="muted">{activeObjectsCount} объектов</span>
        </div>
        <div data-easytag={`${EASYTAG}-src/pages/Map/Map.js-toolbar-spacer`} style={{ flex: 1 }}></div>
        <label data-easytag={`${EASYTAG}-src/pages/Map/Map.js-label-campus`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span data-easytag={`${EASYTAG}-src/pages/Map/Map.js-labelText`}>Кампус</span>
          <select
            data-easytag={`${EASYTAG}-src/pages/Map/Map.js-select-campus`}
            className="select"
            value={selectedCampusId || ''}
            onChange={(e) => setSelectedCampusId(e.target.value || undefined)}
          >
            <option data-easytag={`${EASYTAG}-src/pages/Map/Map.js-option-all`} value="">Все кампусы</option>
            {campuses.map(c => (
              <option data-easytag={`${EASYTAG}-src/pages/Map/Map.js-option-campus`} key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <button
          data-easytag={`${EASYTAG}-src/pages/Map/Map.js-btn-reset`}
          className="button reset"
          onClick={() => setSelectedCampusId(undefined)}
          title="Показать все кампусы"
        >Сбросить</button>
      </div>
      <div data-easytag={`${EASYTAG}-src/pages/Map/Map.js-mapWrap`} className="map-wrap">
        <div data-easytag={`${EASYTAG}-src/pages/Map/Map.js-map`} id="map-container" ref={mapRef}></div>
        <div data-easytag={`${EASYTAG}-src/pages/Map/Map.js-legend`} className="map-legend">
          <span data-easytag={`${EASYTAG}-src/pages/Map/Map.js-legendDotCampus`} className="legend-dot campus"></span>
          <span data-easytag={`${EASYTAG}-src/pages/Map/Map.js-legendLabelCampus`}>Кампус</span>
          <span data-easytag={`${EASYTAG}-src/pages/Map/Map.js-legendDotBuilding`} className="legend-dot building" style={{ marginLeft: 10 }}></span>
          <span data-easytag={`${EASYTAG}-src/pages/Map/Map.js-legendLabelBuilding`}>Здание</span>
        </div>
      </div>
    </section>
  );
}

export default MapPage;
