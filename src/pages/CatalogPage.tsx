import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import {
  fetchActivitiesThunk,
  deleteActivityThunk,
} from '../entities/activity/model/activitySlice';
import { resetFilters } from '../features/activity-filter/model/filterSlice';
import { ActivityCard } from '../entities/activity/ui/ActivityCard';
import { ActivityFilter } from '../features/activity-filter/ui/ActivityFilter';
import { ROUTES } from '../app/routes';
import '../styles/pages/CatalogPage.css';

export const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Состояние Redux Toolkit (Скриншоты 11-12)
  const { activities } = useAppSelector((state) => state.activity);
  const { search, maxTraffic } = useAppSelector((state) => state.filter);

  // Запрос в веб-сервис при монтировании и изменении фильтра трафика (Лекция 10)
  useEffect(() => {
    dispatch(fetchActivitiesThunk(maxTraffic));
  }, [dispatch, maxTraffic]);

  // Клиентская дофильтрация по строке поиска
  const filteredActivities = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return activities;
    return activities.filter((item) => {
      return (
        item.activity_title.toLowerCase().includes(query) ||
        (item.activity_description &&
          item.activity_description.toLowerCase().includes(query))
      );
    });
  }, [activities, search]);

  const handleCardClick = (id: number) => {
    navigate(`${ROUTES.FEED}?activity_id=${id}`);
  };

  const handleDeleteActivity = (id: number) => {
    if (window.confirm('Вы действительно хотите удалить данную активность?')) {
      dispatch(deleteActivityThunk(id));
    }
  };

  const handleReset = () => {
    dispatch(resetFilters());
    dispatch(fetchActivitiesThunk(150));
  };

  return (
    <div className="catalog-page">
      {/* Заголовок страницы */}
      <div className="catalog-header">
        <h1 className="catalog-header-title">
          <span>Каталог активностей</span>
        </h1>
      </div>

      {/* Компонент фильтрации с привязкой к Redux */}
      <ActivityFilter
        onApplyFilters={(newFilters) => {
          dispatch(fetchActivitiesThunk(newFilters.maxTraffic));
        }}
      />

      {/* Плитка (сетка по 2 карточки в ряд) */}
      {filteredActivities.length > 0 ? (
        <div className="catalog-grid">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onClick={() => handleCardClick(activity.id)}
              onDelete={
                activity.is_owner === 1
                  ? () => handleDeleteActivity(activity.id)
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <div className="catalog-empty-state">
          <div className="catalog-empty-title">Ничего не найдено</div>
          <div className="catalog-empty-desc">
            Активностей с заданными параметрами не найдено. Нажмите «Сбросить» для возврата полного списка.
          </div>
          <Button variant="outline-light" size="sm" onClick={handleReset}>
            Сбросить фильтры
          </Button>
        </div>
      )}
    </div>
  );
};
