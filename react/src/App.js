import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import './App.css';
import Layout from './layout/Layout';
import Home from './pages/Home/Home';
import MapPage from './pages/Map/Map';
import RoomsSearch from './pages/RoomsSearch/RoomsSearch';
import BuildingDetails from './pages/BuildingDetails/BuildingDetails';

function App() {
  const TS = Date.now();
  return (
    <div data-easytag={`${TS}-src/App.js-root`}>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="map" element={<MapPage />} />
              <Route path="rooms/search" element={<RoomsSearch />} />
              <Route path="buildings/:id" element={<BuildingDetails />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </div>
  );
}

export default App;
