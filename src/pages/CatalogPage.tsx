import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { NetworkActivity, ActivityFilterParams } from '../entities/activity/model/types';
import { MOCK_ACTIVITIES } from '../entities/activity/model/mock';
import { ActivityCard } from '../entities/activity/ui/ActivityCard';
import { ActivityFilter } from '../features/activity-filter/ui/ActivityFilter';
import { ROUTES } from '../app/routes';
import '../styles/pages/CatalogPage.css';

const DEFAULT_FILTERS: ActivityFilterParams = {
  search: '',
  maxTraffic: 150,
};

export const CatalogPage: React.FC = () => {
  const navigate = useNavigate();

  // Локальное состояние для Лабораторной 5 (без Context и Redux)
  const [activities, setActivities] = useState<NetworkActivity[]>(MOCK_ACTIVITIES);
  const [activeFilters, setActiveFilters] = useState<ActivityFilterParams>(DEFAULT_FILTERS);

  // Фильтрация mock-коллекции по сабмиту формы (Скриншоты 5-6, Лекция 9 слайд 6)
  const handleApplyFilters = (newFilters: ActivityFilterParams) => {
    setActiveFilters(newFilters);

    const query = newFilters.search.trim().toLowerCase();
    const filtered = MOCK_ACTIVITIES.filter((item) => {
      const matchSearch =
        !query ||
        item.activity_title.toLowerCase().includes(query) ||
        item.activity_description.toLowerCase().includes(query);

      const matchTraffic =
        newFilters.maxTraffic === 0 || item.average_traffic_mbps <= newFilters.maxTraffic;

      return matchSearch && matchTraffic;
    });

    setActivities(filtered);
  };

  const handleResetFilters = () => {
    setActiveFilters(DEFAULT_FILTERS);
    // При сбросе возвращаем полный набор mock-данных
    setActivities(MOCK_ACTIVITIES);
  };

  const handleCardClick = (id: number) => {
    navigate(`${ROUTES.DETAIL}/${id}`);
  };

  return (
    <div className="catalog-page">
      {/* Заголовок страницы с бейджем количества */}
      <div className="catalog-header">
        <h1 className="catalog-header-title">
          <span>Каталог активностей</span>
        </h1>
        <span className="catalog-counter-badge">
          Показано: {activities.length} из {MOCK_ACTIVITIES.length}
        </span>
      </div>

      {/* Компонент фильтрации: props initialFilters, onApply, onReset */}
      <ActivityFilter
        initialFilters={activeFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {/* Плитка (сетка) карточек */}
      {activities.length > 0 ? (
        <div className="catalog-grid">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onClick={() => handleCardClick(activity.id)}
            />
          ))}
        </div>
      ) : (
        <div className="catalog-empty-state">
          <div className="catalog-empty-title">Ничего не найдено</div>
          <div className="catalog-empty-desc">
            Активностей с заданными параметрами не найдено. Нажмите «Сбросить» для возврата полного списка.
          </div>
          <Button variant="outline-light" size="sm" onClick={handleResetFilters}>
            Сбросить фильтры
          </Button>
        </div>
      )}
    </div>
  );
};
