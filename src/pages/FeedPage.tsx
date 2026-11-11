import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import {
  fetchFeedThunk,
  toggleLikeThunk,
  deleteActivityThunk,
} from '../entities/activity/model/activitySlice';
import { MediaViewer } from '../widgets/media-viewer/MediaViewer';
import '../styles/pages/FeedPage.css';

export const FeedPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { feedActivity, activities } = useAppSelector(
    (state) => state.activity
  );
  const [expandedDesc, setExpandedDesc] = useState<boolean>(false);

  // Синхронизация с query-параметром ?activity_id=... (например, при переходе из каталога)
  useEffect(() => {
    const actId = searchParams.get('activity_id');
    const parsedId = actId ? Number(actId) : undefined;
    if (parsedId !== undefined) {
      dispatch(fetchFeedThunk({ activity_id: parsedId }));
    } else {
      dispatch(fetchFeedThunk());
    }
  }, [searchParams, dispatch]);

  const currentActivity = feedActivity || activities[0];

  const handleNext = () => {
    setExpandedDesc(false);
    if (currentActivity?.id !== undefined) {
      // Серверный скролл ленты: бэкенд сам находит следующую карточку после current_id (с циклическим возвратом)
      dispatch(fetchFeedThunk({ current_id: currentActivity.id }));
    } else if (activities.length > 0) {
      dispatch(fetchFeedThunk({ activity_id: activities[0].id }));
    } else {
      dispatch(fetchFeedThunk());
    }
  };

  const handlePrev = () => {
    setExpandedDesc(false);
    if (activities.length > 0 && currentActivity) {
      const curIdx = activities.findIndex((a) => a.id === currentActivity.id);
      if (curIdx !== -1) {
        const prevIdx = (curIdx - 1 + activities.length) % activities.length;
        dispatch(fetchFeedThunk({ activity_id: activities[prevIdx].id }));
      }
    }
  };

  // Навигация с клавиатуры (стрелки вверх/вниз)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        handleNext();
      } else if (e.key === 'ArrowUp') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentActivity, activities]);

  const handleToggleLike = async () => {
    if (!isAuthenticated || !currentActivity) return;
    try {
      await dispatch(toggleLikeThunk(currentActivity.id));
    } catch {
      // Игнорируем ошибки сети
    }
  };

  const handleDelete = async () => {
    if (!currentActivity) return;
    if (window.confirm('Удалить эту активность?')) {
      await dispatch(deleteActivityThunk(currentActivity.id));
      dispatch(fetchFeedThunk());
    }
  };

  if (!currentActivity) {
    return (
      <div className="feed-page d-flex align-items-center justify-content-center text-secondary">
        <div>Активности не найдены</div>
      </div>
    );
  }

  const isLiked = currentActivity.is_liked === 1;

  return (
    <div className="feed-page">
      {/* Верхний бар с логотипом */}
      <div className="feed-top-bar">
        <div className="feed-logo">NETWORK ACTIVITIES</div>
      </div>

      {/* Медиа контейнер (видео или fallback-фото) */}
      <div
        className="feed-media-wrapper"
        onClick={handleNext}
        title="Нажмите в любое место для перехода к следующей активности"
      >
        <MediaViewer
          key={`feed-${currentActivity.id}`}
          videoUrl={currentActivity.preview_video_url}
          imageUrl={currentActivity.preview_image_url}
          title={currentActivity.activity_title}
        />
      </div>

      {/* Нижняя оверлейная плашка с описанием и кнопками */}
      <div className="feed-overlay">
        <div className="feed-left-col">
          <div className="d-flex align-items-center gap-2 mb-1">
            <h2 className="feed-title mb-0">{currentActivity.activity_title}</h2>
            {currentActivity.is_owner === 1 && (
              <span className="feed-owner-badge">Ваше</span>
            )}
          </div>

          <div className={`feed-desc ${expandedDesc ? '' : 'collapsed'}`}>
            {currentActivity.activity_description || 'Описание отсутствует'}
          </div>
          {currentActivity.activity_description && (
            <button
              type="button"
              className="feed-more-btn"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedDesc(!expandedDesc);
              }}
            >
              {expandedDesc ? 'Свернуть' : 'Подробнее'}
            </button>
          )}
        </div>

        <div className="feed-right-col">
          {/* Кнопка удаления для владельца активности */}
          {currentActivity.is_owner === 1 && (
            <button
              type="button"
              className="feed-action-btn feed-delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              title="Удалить мою активность"
            >
              🗑
            </button>
          )}

          {/* Кнопка Лайка (заблокирована для неавторизованных пользователей) */}
          <button
            type="button"
            className={`feed-action-btn ${isLiked ? 'liked' : ''} ${!isAuthenticated ? 'disabled' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!isAuthenticated) return;
              handleToggleLike();
            }}
            disabled={!isAuthenticated}
            title={
              isAuthenticated
                ? 'Отметка нравится'
                : 'Для отметки «Нравится» необходимо войти в систему'
            }
          >
            <svg
              width="22"
              height="20"
              viewBox="0 0 16 14"
              fill={isLiked ? '#FF4B72' : 'none'}
              stroke={isLiked ? '#FF4B72' : '#FFFFFF'}
              strokeWidth="1.5"
            >
              <path d="M1.64547 2.59989C1.22508 3.21118 1.00001 3.9356 1 4.67747C1 6.21082 2.00008 7.34416 3.00015 8.34417L6.67244 11.8989C6.79846 12.04 6.95307 12.1526 7.126 12.2294C7.29892 12.3061 7.48619 12.3452 7.67537 12.344C7.86456 12.3428 8.05132 12.3013 8.22325 12.2224C8.39519 12.1435 8.54836 12.0289 8.67259 11.8862L12.3342 8.34417C13.3343 7.34416 14.3344 6.20415 14.3344 4.67747C14.3379 3.93397 14.1149 3.20702 13.6951 2.59339C13.2752 1.97975 12.6784 1.50852 11.9841 1.24243C11.2898 0.976333 10.5309 0.927992 9.80843 1.10384C9.08597 1.27968 8.4342 1.67138 7.93987 2.22678C7.90494 2.26412 7.86271 2.29389 7.81581 2.31425C7.7689 2.3346 7.71831 2.3451 7.66718 2.3451C7.61605 2.3451 7.56546 2.3346 7.51855 2.31425C7.47164 2.29389 7.42942 2.26412 7.39449 2.22678C6.8986 1.67496 6.24698 1.28653 5.52569 1.1128C4.8044 0.939065 4.04737 0.988196 3.35459 1.2537C2.66181 1.51921 2.06586 1.98861 1.64547 2.59989Z" />
            </svg>
            <span className="feed-action-text">{currentActivity.likes_count || 0}</span>
          </button>

          {/* Параметр трафика */}
          <div className="feed-param-badge" title="Средний трафик">
            <span className="feed-param-val">{currentActivity.average_traffic_mbps ?? 0}</span>
            <span className="feed-param-lbl">Мбит/с</span>
          </div>

          {/* Параметр задержки */}
          <div className="feed-param-badge" title="Макс. задержка">
            <span className="feed-param-val">{currentActivity.max_latency_ms ?? 0}</span>
            <span className="feed-param-lbl">мс</span>
          </div>

          {/* Предыдущая активность */}
          <button
            type="button"
            className="feed-nav-btn feed-nav-prev"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            title="Предыдущая активность"
          >
            ↑
          </button>

          {/* Следующая активность */}
          <button
            type="button"
            className="feed-nav-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            title="Следующая активность"
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
};
