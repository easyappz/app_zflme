import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  const TS = Date.now();
  return (
    <div className="layout" data-easytag={`${TS}-src/layout/Layout.jsx-root`}>
      <header className="layout__header" data-easytag={`${TS}-src/layout/Layout.jsx-header`}>
        <div className="container header__inner" data-easytag={`${TS}-src/layout/Layout.jsx-header-inner`}>
          <Link to="/" className="brand" data-easytag={`${TS}-src/layout/Layout.jsx-brand`}>
            HSE Навигация
          </Link>
          <nav className="nav" data-easytag={`${TS}-src/layout/Layout.jsx-nav`}>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'} data-easytag={`${TS}-src/layout/Layout.jsx-nav-home`}>
              Главная
            </NavLink>
            <NavLink to="/map" className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'} data-easytag={`${TS}-src/layout/Layout.jsx-nav-map`}>
              Карта
            </NavLink>
            <NavLink to="/rooms/search" className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'} data-easytag={`${TS}-src/layout/Layout.jsx-nav-rooms`}>
              Поиск аудиторий
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="layout__main" data-easytag={`${TS}-src/layout/Layout.jsx-main`}>
        <div className="container" data-easytag={`${TS}-src/layout/Layout.jsx-main-container`}>
          <Outlet />
        </div>
      </main>
      <footer className="layout__footer" data-easytag={`${TS}-src/layout/Layout.jsx-footer`}>
        <div className="container footer__inner" data-easytag={`${TS}-src/layout/Layout.jsx-footer-inner`}>
          <p data-easytag={`${TS}-src/layout/Layout.jsx-footer-text`}>
            © {new Date().getFullYear()} HSE Навигация — учебный проект Easyappz
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
