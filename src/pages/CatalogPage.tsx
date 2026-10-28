import React, { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { AppOutletContext } from '../layouts/AppLayout';
import { ActivityFilterParams } from '../types/activity';
import { filterActivities } from '../modules/activitiesApi';
import { FilterForm } from '../components/Filter/FilterForm';
import { ActivityCard } from '../components/CatalogCard/ActivityCard';
import { ROUTES } from '../Routes';
import './CatalogPage.css';

const DEFAULT_FILTERS: ActivityFilterParams = {
  search: '',
  maxTraffic: 150,
  sortBy: 'default',
};

export const CatalogPage: React.FC = () => {
  const { activities } = useOutletContext<AppOutletContext>();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<ActivityFilterParams>(DEFAULT_FILTERS);

  const filteredActivities = useMemo(() => {
    return filterActivities(activities, filters);
  }, [activities, filters]);

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleCardClick = (id: number) => {
    navigate(`${ROUTES.DETAIL}/${id}`);
  };

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <h1 className="catalog-header-title">
          <span>Каталог активностей</span>
        </h1>
        <span className="catalog-counter-badge">
          {filteredActivities.length} из {activities.length}
        </span>
      </div>

      {/* Filter Form using React-Bootstrap */}
      <FilterForm
        filters={filters}
        onChange={setFilters}
        onReset={handleReset}
      />

      {/* Grid of Cards */}
      {filteredActivities.length > 0 ? (
        <div className="catalog-grid">
          {filteredActivities.map((activity) => (
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
            Попробуйте изменить параметры поиска или сбросить фильтр по объему трафика.
          </div>
          <Button variant="outline-light" size="sm" onClick={handleReset}>
            Сбросить фильтры
          </Button>
        </div>
      )}
    </div>
  );
};
