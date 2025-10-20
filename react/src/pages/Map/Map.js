import React from 'react';
import { useLocation } from 'react-router-dom';
import './Map.css';

function MapPage() {
  const TS = Date.now();
  const location = useLocation();
  const focusBuildingId = location.state && location.state.focusBuildingId ? location.state.focusBuildingId : null;

  return (
    <div data-easytag={`${TS}-src/pages/Map/Map.js-root`} className="map-root">
      <h1 data-easytag={`${TS}-src/pages/Map/Map.js-title`} className="map-title">Карта кампуса</h1>
      {focusBuildingId ? (
        <div data-easytag={`${TS}-src/pages/Map/Map.js-focus`} className="map-focus">Фокус на здание: <strong data-easytag={`${TS}-src/pages/Map/Map.js-focus-strong`}>{focusBuildingId}</strong></div>
      ) : (
        <div data-easytag={`${TS}-src/pages/Map/Map.js-no-focus`} className="map-focus">Выберите здание, чтобы увидеть его на карте</div>
      )}
      <div data-easytag={`${TS}-src/pages/Map/Map.js-canvas`} className="map-canvas">
        <div data-easytag={`${TS}-src/pages/Map/Map.js-canvas-placeholder`} className="map-placeholder">Здесь будет интерактивная карта</div>
      </div>
    </div>
  );
}

export default MapPage;
