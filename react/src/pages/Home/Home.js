import React from 'react';

const EASYTAG = Date.now();

function Home() {
  return (
    <div data-easytag={`${EASYTAG}-src/pages/Home/Home.js-root`} style={{ maxWidth: 960, margin: '24px auto', padding: '0 16px' }}>
      <h1 data-easytag={`${EASYTAG}-src/pages/Home/Home.js-title`} style={{ marginBottom: 12, color: '#111827' }}>Добро пожаловать</h1>
      <p data-easytag={`${EASYTAG}-src/pages/Home/Home.js-text`} style={{ color: '#4b5563' }}>
        Откройте страницу «Карта кампусов», чтобы посмотреть расположение кампусов и зданий.
      </p>
    </div>
  );
}

export default Home;
