import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Badge } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import { deleteActivityThunk } from '../entities/activity/model/activitySlice';
import { NetworkActivityResponse } from '../shared/api/generated/Api';
import { MediaViewer } from '../widgets/media-viewer/MediaViewer';
import { ROUTES } from '../app/routes';
import '../styles/pages/DetailPage.css';

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { activities } = useAppSelector((state) => state.activity);
  const [activity, setActivity] = useState<NetworkActivityResponse | undefined>();

  useEffect(() => {
    if (!id) return;
    const found = activities.find((item) => String(item.id) === id);
    setActivity(found);
  }, [id, activities]);

  const handleNext = () => {
    if (!activity || activities.length === 0) return;
    const currentIndex = activities.findIndex((item) => item.id === activity.id);
    const nextItem = activities[(currentIndex + 1) % activities.length];
    if (nextItem) {
      navigate(`${ROUTES.DETAIL}/${nextItem.id}`);
    }
  };

  const handleBack = () => {
    navigate(ROUTES.CATALOG);
  };

  const handleDelete = () => {
    if (!activity) return;
    if (window.confirm('Вы действительно хотите удалить данную активность?')) {
      dispatch(deleteActivityThunk(activity.id));
      navigate(ROUTES.CATALOG);
    }
  };

  if (!activity) {
    return (
      <div className="detail-page text-center py-5">
        <h2 className="mb-3">Активность не найдена</h2>
        <p className="text-muted mb-4">
          Активность с идентификатором #{id} отсутствует в каталоге.
        </p>
        <Button variant="outline-light" onClick={handleBack}>
          Вернуться в каталог
        </Button>
      </div>
    );
  }

  return (
    <div className="detail-page">
      {/* Верхний бар с кнопкой назад и бейджем */}
      <div className="detail-top-bar">
        <Button onClick={handleBack} className="btn-detail-back">
          ← Назад в каталог
        </Button>
        <div className="d-flex align-items-center gap-2">
          {activity.is_owner === 1 && (
            <Badge bg="success" className="px-2 py-1">
              Ваше
            </Badge>
          )}
          <Badge bg="dark" className="border border-secondary text-muted px-3 py-2">
            ID: #{activity.id}
          </Badge>
        </div>
      </div>

      {/* Медиа контейнер с видео/изображением и fallback */}
      <div className="detail-media-card">
        <MediaViewer
          key={`detail-${activity.id}`}
          videoUrl={activity.preview_video_url}
          imageUrl={activity.preview_image_url}
          title={activity.activity_title}
        />
      </div>

      {/* Информационная карточка */}
      <div className="detail-info-card">
        <div className="detail-title-row">
          <h1 className="detail-title">{activity.activity_title}</h1>
          <span className="detail-badge">Опубликовано</span>
        </div>

        <div className="detail-description">
          {activity.activity_description || 'Описание отсутствует'}
        </div>

        {/* Метрики активности */}
        <div className="detail-metrics-grid">
          <div className="detail-metric-box">
            <div className="detail-metric-icon">⚡</div>
            <div className="detail-metric-value">{activity.average_traffic_mbps ?? 0}</div>
            <div className="detail-metric-label">Мбит/с трафик</div>
          </div>

          <div className="detail-metric-box">
            <div className="detail-metric-icon">⏱</div>
            <div className="detail-metric-value">{activity.max_latency_ms ?? 0}</div>
            <div className="detail-metric-label">мс задержка</div>
          </div>

          <div className="detail-metric-box">
            <div className="detail-metric-icon">♡</div>
            <div className="detail-metric-value">{activity.likes_count || 0}</div>
            <div className="detail-metric-label">Лайков</div>
          </div>
        </div>

        {/* Кнопка удаления для владельца */}
        {activity.is_owner === 1 && (
          <Button
            variant="outline-danger"
            className="w-100 mb-2 py-2"
            onClick={handleDelete}
          >
            Удалить активность
          </Button>
        )}

        {/* Кнопка перехода к следующей активности */}
        <Button onClick={handleNext} className="btn-detail-next">
          <span>Следующая активность</span>
          <span>→</span>
        </Button>
      </div>
    </div>
  );
};
