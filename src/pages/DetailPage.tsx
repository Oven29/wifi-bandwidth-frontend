import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Badge } from 'react-bootstrap';
import { NetworkActivity } from '../entities/activity/model/types';
import { MOCK_ACTIVITIES } from '../entities/activity/model/mock';
import { MediaViewer } from '../widgets/media-viewer/MediaViewer';
import { ROUTES } from '../app/routes';
import '../styles/pages/DetailPage.css';

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Локальное состояние карточки (без Context и Redux)
  const [activity, setActivity] = useState<NetworkActivity | undefined>();

  useEffect(() => {
    if (!id) return;
    const found = MOCK_ACTIVITIES.find((item) => String(item.id) === id);
    setActivity(found);
  }, [id]);

  const handleNext = () => {
    if (!activity) return;
    const currentIndex = MOCK_ACTIVITIES.findIndex((item) => item.id === activity.id);
    const nextItem = MOCK_ACTIVITIES[(currentIndex + 1) % MOCK_ACTIVITIES.length];
    if (nextItem) {
      navigate(`${ROUTES.DETAIL}/${nextItem.id}`);
    }
  };

  const handleBack = () => {
    navigate(ROUTES.CATALOG);
  };

  if (!activity) {
    return (
      <div className="detail-page text-center py-5">
        <h2 className="mb-3">Активность не найдена</h2>
        <p className="text-muted mb-4">
          Активность с идентификатором #{id} отсутствует в коллекции mock-данных.
        </p>
        <Button variant="outline-light" onClick={handleBack}>
          Вернуться в каталог
        </Button>
      </div>
    );
  }

  return (
    <div className="detail-page">
      {/* Верхний бар с кнопкой назад и ID */}
      <div className="detail-top-bar">
        <Button onClick={handleBack} className="btn-detail-back">
          ← Назад в каталог
        </Button>
        <Badge bg="dark" className="border border-secondary text-muted px-3 py-2">
          ID: #{activity.id}
        </Badge>
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
          {activity.activity_description}
        </div>

        {/* Метрики активности */}
        <div className="detail-metrics-grid">
          <div className="detail-metric-box">
            <div className="detail-metric-icon">⚡</div>
            <div className="detail-metric-value">{activity.average_traffic_mbps}</div>
            <div className="detail-metric-label">Мбит/с трафик</div>
          </div>

          <div className="detail-metric-box">
            <div className="detail-metric-icon">⏱</div>
            <div className="detail-metric-value">{activity.max_latency_ms}</div>
            <div className="detail-metric-label">мс задержка</div>
          </div>

          <div className="detail-metric-box">
            <div className="detail-metric-icon">♡</div>
            <div className="detail-metric-value">{activity.likes_count}</div>
            <div className="detail-metric-label">Лайков</div>
          </div>
        </div>

        {/* Кнопка перехода к следующей активности */}
        <Button onClick={handleNext} className="btn-detail-next">
          <span>Следующая активность</span>
          <span>→</span>
        </Button>
      </div>
    </div>
  );
};
