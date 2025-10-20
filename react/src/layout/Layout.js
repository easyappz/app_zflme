import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './layout.css';

const EASYTAG = Date.now();

function Layout() {
  return (
    <div data-easytag={`${EASYTAG}-src/layout/Layout.js-root`}>
      <header data-easytag={`${EASYTAG}-src/layout/Layout.js-header`} style={{
        position: 'sticky', top: 0, zIndex: 10, background: '#ffffff', borderBottom: '1px solid #eaeaea',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <div data-easytag={`${EASYTAG}-src/layout/Layout.js-headerInner`} style={{
          maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px'
        }}>
          <div data-easytag={`${EASYTAG}-src/layout/Layout.js-brand`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span data-easytag={`${EASYTAG}-src/layout/Layout.js-brandMark`} style={{ width: 10, height: 10, background: '#4f46e5', display: 'inline-block', borderRadius: 2 }}></span>
            <strong data-easytag={`${EASYTAG}-src/layout/Layout.js-brandName`} style={{ color: '#111827' }}>Easyappz</strong>
          </div>
          <nav data-easytag={`${EASYTAG}-src/layout/Layout.js-nav`}>
            <ul data-easytag={`${EASYTAG}-src/layout/Layout.js-navList`} style={{ listStyle: 'none', display: 'flex', gap: 12, margin: 0, padding: 0 }}>
              <li data-easytag={`${EASYTAG}-src/layout/Layout.js-navItem-home`}><Link data-easytag={`${EASYTAG}-src/layout/Layout.js-link-home`} to="/" style={{ textDecoration: 'none', color: '#374151' }}>Главная</Link></li>
              <li data-easytag={`${EASYTAG}-src/layout/Layout.js-navItem-map`}><Link data-easytag={`${EASYTAG}-src/layout/Layout.js-link-map`} to="/map" style={{ textDecoration: 'none', color: '#374151' }}>Карта кампусов</Link></li>
              <li data-easytag={`${EASYTAG}-src/layout/Layout.js-navItem-rooms`}><Link data-easytag={`${EASYTAG}-src/layout/Layout.js-link-rooms`} to="/rooms/search" style={{ textDecoration: 'none', color: '#374151' }}>Поиск аудиторий</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      <main data-easytag={`${EASYTAG}-src/layout/Layout.js-main`} style={{ minHeight: 'calc(100vh - 60px)' }}>
        <Outlet />
      </main>
      <footer data-easytag={`${EASYTAG}-src/layout/Layout.js-footer`} style={{ borderTop: '1px solid #eaeaea', padding: '12px 16px', color: '#6b7280', background: '#fafafa' }}>
        <div data-easytag={`${EASYTAG}-src/layout/Layout.js-footerInner`} style={{ maxWidth: 1200, margin: '0 auto' }}>
          <span data-easytag={`${EASYTAG}-src/layout/Layout.js-footerText`}>© {new Date().getFullYear()} Easyappz</span>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
