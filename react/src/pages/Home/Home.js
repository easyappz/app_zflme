import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  const TS = Date.now();
  return (
    <div data-easytag={`${TS}-src/pages/Home/Home.js-root`} className="home-root">
      <h1 data-easytag={`${TS}-src/pages/Home/Home.js-title`} className="home-title">Добро пожаловать</h1>
      <p data-easytag={`${TS}-src/pages/Home/Home.js-sub`} className="home-sub">Ищите аудитории, просматривайте здания и стройте маршруты внутри кампуса.</p>
      <div data-easytag={`${TS}-src/pages/Home/Home.js-actions`} className="home-actions">
        <Link data-easytag={`${TS}-src/pages/Home/Home.js-link-rooms`} className="home-btn primary" to="/rooms/search">Поиск аудиторий</Link>
        <Link data-easytag={`${TS}-src/pages/Home/Home.js-link-map`} className="home-btn" to="/map">Открыть карту</Link>
      </div>
    </div>
  );
}

export default Home;
