import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Button, Badge, Spinner } from 'react-bootstrap';
import { AppOutletContext } from '../layouts/AppLayout';
import { NetworkActivity } from '../types/activity';
import { getActivityById } from '../modules/activitiesApi';
import { DEFAULT_IMAGE, DEFAULT_VIDEO } from '../modules/mock';
import { ROUTES } from '../Routes';
import './DetailPage.css';

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activities } = useOutletContext<AppOutletContext>();

  const [activity, setActivity] = useState<NetworkActivity | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setVideoError(false);

    // Try finding in the context activities list first
    const foundInContext = activities.find((item) => String(item.id) === id);
    if (foundInContext) {
      setActivity(foundInContext);
      setLoading(false);
      return;
    }

    // Fallback to mock retrieval by ID
    getActivityById(id).then((res) => {
      setActivity(res);
      setLoading(false);
    });
  }, [id, activities]);

  const handleNext = () => {
    if (!activity || activities.length === 0) return;
    const currentIndex = activities.findIndex((item) => item.id === activity.id);
    const nextItem = activities[currentIndex + 1] || activities[0];
    if (nextItem) {
      navigate(`${ROUTES.DETAIL}/${nextItem.id}`);
    }
  };

  const handleBackToCatalog = () => {
    navigate(ROUTES.CATALOG);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="detail-page text-center py-5">
        <h2>Активность не найдена</h2>
        <p className="text-muted">Запрошенная сетевая активность с ID {id} отсутствует.</p>
        <Button variant="outline-light" onClick={handleBackToCatalog}>
          Вернуться в каталог
        </Button>
      </div>
    );
  }

  const hasVideo = !!activity.preview_video_url && !videoError;
  const videoSource = activity.preview_video_url || DEFAULT_VIDEO;
  const imageSource = activity.preview_image_url || DEFAULT_IMAGE;

  return (
    <div className="detail-page">
      {/* Top Bar with Back Button */}
      <div className="detail-top-bar">
        <Button onClick={handleBackToCatalog} className="btn-detail-back">
          <span>← Назад к плитке</span>
        </Button>
        <Badge bg="dark" className="border border-secondary text-muted">
          ID: #{activity.id}
        </Badge>
      </div>

      {/* Media Box with Video / Image / Fallbacks */}
      <div className="detail-media-card">
        {hasVideo ? (
          <video
            key={videoSource}
            className="detail-video"
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
            poster={imageSource}
          >
            <source src={videoSource} type="video/mp4" />
          </video>
        ) : (
          <img
            className="detail-image"
            src={imageSource}
            alt={activity.activity_title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
            }}
          />
        )}
      </div>

      {/* Info Card with specs and description */}
      <div className="detail-info-card">
        <div className="detail-title-row">
          <h1 className="detail-title">{activity.activity_title}</h1>
          <span className="detail-badge">Опубликовано</span>
        </div>

        <div className="detail-description">
          {activity.activity_description}
        </div>

        {/* Technical specs grid */}
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

        {/* Action Button: Next Activity in sequence */}
        <Button onClick={handleNext} className="btn-detail-next">
          <span>Следующая активность</span>
          <span>→</span>
        </Button>
      </div>
    </div>
  );
};
