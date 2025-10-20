import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css';

const MapPage = () => {
  const TS = Date.now();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [37.6173, 55.7558],
      zoom: 11
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

    mapRef.current = map;
    return () => {
      map.remove();
    };
  }, []);

  return (
    <section className="map-page" data-easytag={`${TS}-src/pages/Map/Map.jsx-section`}>
      <div className="map-header" data-easytag={`${TS}-src/pages/Map/Map.jsx-header`}>
        <h1 data-easytag={`${TS}-src/pages/Map/Map.jsx-title`}>Карта кампусов</h1>
        <p data-easytag={`${TS}-src/pages/Map/Map.jsx-desc`}>Исследуйте расположение корпусов НИУ ВШЭ</p>
      </div>
      <div ref={mapContainerRef} className="map-container" data-easytag={`${TS}-src/pages/Map/Map.jsx-map-container`} />
    </section>
  );
};

export default MapPage;
