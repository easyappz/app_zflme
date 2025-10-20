import React from 'react';

const EASYTAG = Date.now();

function RoomsSearch() {
  return (
    <div data-easytag={`${EASYTAG}-src/pages/RoomsSearch/RoomsSearch.js-root`} style={{ maxWidth: 960, margin: '24px auto', padding: '0 16px' }}>
      <h1 data-easytag={`${EASYTAG}-src/pages/RoomsSearch/RoomsSearch.js-title`} style={{ marginBottom: 8, color: '#111827' }}>Поиск аудиторий</h1>
      <p data-easytag={`${EASYTAG}-src/pages/RoomsSearch/RoomsSearch.js-text`} style={{ color: '#4b5563' }}>
        Раздел в разработке. Воспользуйтесь картой для выбора здания и перехода к деталям.
      </p>
    </div>
  );
}

export default RoomsSearch;
