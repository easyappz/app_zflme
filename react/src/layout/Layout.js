import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './Layout.css';

function Layout() {
  const TS = Date.now();
  const location = useLocation();

  return (
    <div data-easytag={`${TS}-src/layout/Layout.js-root`} className="layout-root">
      <header data-easytag={`${TS}-src/layout/Layout.js-header`} className="layout-header">
        <div data-easytag={`${TS}-src/layout/Layout.js-brand`} className="brand">
          <span data-easytag={`${TS}-src/layout/Layout.js-brand-text`} className="brand-text">Campus Navigator</span>
        </div>
        <nav data-easytag={`${TS}-src/layout/Layout.js-nav`} className="nav">
          <Link data-easytag={`${TS}-src/layout/Layout.js-link-home`} to="/" className={location.pathname === '/' ? 'active' : ''}>Главная</Link>
          <Link data-easytag={`${TS}-src/layout/Layout.js-link-map`} to="/map" className={location.pathname.startsWith('/map') ? 'active' : ''}>Карта</Link>
          <Link data-easytag={`${TS}-src/layout/Layout.js-link-rooms`} to="/rooms/search" className={location.pathname.startsWith('/rooms') ? 'active' : ''}>Поиск аудиторий</Link>
        </nav>
      </header>
      <main data-easytag={`${TS}-src/layout/Layout.js-main`} className="layout-main">
        <Outlet />
      </main>
      <footer data-easytag={`${TS}-src/layout/Layout.js-footer`} className="layout-footer">
        <span data-easytag={`${TS}-src/layout/Layout.js-footer-text`}>© {new Date().getFullYear()} Campus Navigator</span>
      </footer>
    </div>
  );
}

export default Layout;
