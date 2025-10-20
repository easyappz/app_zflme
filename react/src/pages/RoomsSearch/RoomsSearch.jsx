import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchAll } from '../../api/search';
import { Link } from 'react-router-dom';
import './RoomsSearch.css';

const RoomsSearch = () => {
  const TS = Date.now();
  const [q, setQ] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', { q }],
    queryFn: () => searchAll({ q }),
    enabled: q.trim().length >= 2
  });

  return (
    <section className="search-page" data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-section`}>
      <div className="search-box" data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-search-box`}>
        <h1 data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-title`}>Поиск аудиторий и зданий</h1>
        <form className="search-form" onSubmit={(e) => e.preventDefault()} data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-form`}>
          <input
            type="text"
            className="search-input"
            placeholder="Введите номер аудитории, название здания или кампуса"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-input`}
          />
        </form>
      </div>

      <div className="results" data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-results`}>
        {q.trim().length < 2 && (
          <div className="hint" data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-hint`}>
            Введите минимум 2 символа для начала поиска.
          </div>
        )}

        {isLoading && (
          <div className="hint" data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-loading`}>
            Поиск...
          </div>
        )}
        {error && (
          <div className="error" data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-error`}>
            Ошибка при поиске
          </div>
        )}

        {data && (
          <div className="results-grid" data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-results-grid`}>
            <div className="results-group" data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-group-campuses`}>
              <h3 data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-group-title-campuses`}>Кампусы</h3>
              <ul className="list" data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-list-campuses`}>
                {(data.campuses || []).map((c) => (
                  <li key={c.id} className="list-item" data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-item-campus`}>
                    <span data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-item-campus-title`}>{c.title}</span>
                    <small className="muted" data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-item-campus-sub`}>{c.subtitle}</small>
                  </li>
                ))}
              </ul>
            </div>

            <div className="results-group" data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-group-buildings`}>
              <h3 data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-group-title-buildings`}>Здания</h3>
              <ul className="list" data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-list-buildings`}>
                {(data.buildings || []).map((b) => (
                  <li key={b.id} className="list-item" data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-item-building`}>
                    <Link to={`/buildings/${b.id}`} className="link" data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-link-building`}>
                      {b.title}
                    </Link>
                    <small className="muted" data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-item-building-sub`}>{b.subtitle}</small>
                  </li>
                ))}
              </ul>
            </div>

            <div className="results-group" data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-group-rooms`}>
              <h3 data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-group-title-rooms`}>Аудитории</h3>
              <ul className="list" data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-list-rooms`}>
                {(data.rooms || []).map((r) => (
                  <li key={r.id} className="list-item" data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-item-room`}>
                    <span data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-item-room-title`}>{r.title}</span>
                    <small className="muted" data-easytag={`${TS}-src/pages/RoomsSearch/RoomsSearch.jsx-item-room-sub`}>{r.subtitle}</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RoomsSearch;
