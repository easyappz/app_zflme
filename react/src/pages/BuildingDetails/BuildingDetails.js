import React from 'react';
import { useParams } from 'react-router-dom';

const EASYTAG = Date.now();

function BuildingDetails() {
  const { id } = useParams();
  return (
    <div data-easytag={`${EASYTAG}-src/pages/BuildingDetails/BuildingDetails.js-root`} style={{ maxWidth: 960, margin: '24px auto', padding: '0 16px' }}>
      <h1 data-easytag={`${EASYTAG}-src/pages/BuildingDetails/BuildingDetails.js-title`} style={{ marginBottom: 8, color: '#111827' }}>Здание</h1>
      <p data-easytag={`${EASYTAG}-src/pages/BuildingDetails/BuildingDetails.js-id`} style={{ color: '#4b5563' }}>ID: {id}</p>
      <p data-easytag={`${EASYTAG}-src/pages/BuildingDetails/BuildingDetails.js-note`} style={{ color: '#6b7280' }}>
        Здесь может быть подробная информация о здании, этажах и аудиториях.
      </p>
    </div>
  );
}

export default BuildingDetails;
