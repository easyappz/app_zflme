import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { listCampuses } from '../../api/campuses';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const TS = Date.now();
  const { data, isLoading, error } = useQuery({
    queryKey: ['campuses', { page: 1, limit: 12 }],
    queryFn: () => listCampuses({ page: 1, limit: 12 })
  });

  return (
    <section className="home" data-easytag={`${TS}-src/pages/Home/Home.jsx-section`}>
      <div className="hero" data-easytag={`${TS}-src/pages/Home/Home.jsx-hero`}>
        <h1 data-easytag={`${TS}-src/pages/Home/Home.jsx-title`}>Навигация по кампусам НИУ ВШЭ</h1>
        <p data-easytag={`${TS}-src/pages/Home/Home.jsx-subtitle`}>
          Исследуйте корпуса на карте, ищите аудитории и стройте маршруты внутри зданий.
        </p>
        <div className="hero__actions" data-easytag={`${TS}-src/pages/Home/Home.jsx-hero-actions`}>
          <Link to="/map" className="btn btn--primary" data-easytag={`${TS}-src/pages/Home/Home.jsx-btn-map`}>
            Открыть карту
          </Link>
          <Link to="/rooms/search" className="btn" data-easytag={`${TS}-src/pages/Home/Home.jsx-btn-search`}>
            Поиск аудиторий
          </Link>
        </div>
      </div>

      <div className="block" data-easytag={`${TS}-src/pages/Home/Home.jsx-block-campuses`}>
        <div className="block__header" data-easytag={`${TS}-src/pages/Home/Home.jsx-block-header`}>
          <h2 data-easytag={`${TS}-src/pages/Home/Home.jsx-block-title`}>Кампусы</h2>
        </div>
        <div className="grid" data-easytag={`${TS}-src/pages/Home/Home.jsx-grid`}>
          {isLoading && (
            <div className="card" data-easytag={`${TS}-src/pages/Home/Home.jsx-loading`}>
              Загрузка кампусов...
            </div>
          )}
          {error && (
            <div className="card error" data-easytag={`${TS}-src/pages/Home/Home.jsx-error`}>
              Не удалось загрузить кампусы
            </div>
          )}
          {data && data.items && data.items.map((c) => (
            <div key={c._id} className="card" data-easytag={`${TS}-src/pages/Home/Home.jsx-campus-card`}>
              <div className="card__title" data-easytag={`${TS}-src/pages/Home/Home.jsx-campus-title`}>{c.name}</div>
              <div className="card__subtitle" data-easytag={`${TS}-src/pages/Home/Home.jsx-campus-subtitle`}>{c.code}</div>
              <div className="card__actions" data-easytag={`${TS}-src/pages/Home/Home.jsx-campus-actions`}>
                <Link to="/map" className="link" data-easytag={`${TS}-src/pages/Home/Home.jsx-campus-open-map`}>
                  Показать на карте
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
