import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AppOutletContext } from '../layouts/AppLayout';
import { DEFAULT_IMAGE, DEFAULT_VIDEO } from '../modules/mock';
import './FeedPage.css';

export const FeedPage: React.FC = () => {
  const { activities } = useOutletContext<AppOutletContext>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedDesc, setExpandedDesc] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [likesMap, setLikesMap] = useState<Record<number, { count: number; liked: boolean }>>({});

  const currentActivity = activities[currentIndex] || activities[0];

  const handleNext = () => {
    if (activities.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % activities.length);
    setExpandedDesc(false);
    setVideoError(false);
  };

  const toggleLike = (id: number) => {
    setLikesMap((prev) => {
      const current = prev[id] || { count: currentActivity.likes_count, liked: false };
      const newLiked = !current.liked;
      return {
        ...prev,
        [id]: {
          count: current.count + (newLiked ? 1 : -1),
          liked: newLiked,
        },
      };
    });
  };

  if (!currentActivity) {
    return (
      <div className="feed-empty">
        <h3>Нет активностей для показа</h3>
        <p>Список активностей пуст.</p>
      </div>
    );
  }

  const currentLikeInfo = likesMap[currentActivity.id] || {
    count: currentActivity.likes_count,
    liked: false,
  };

  const hasVideo = !!currentActivity.preview_video_url && !videoError;
  const videoSource = currentActivity.preview_video_url || DEFAULT_VIDEO;
  const imageSource = currentActivity.preview_image_url || DEFAULT_IMAGE;

  return (
    <div className="feed-page">
      <div className="feed-top-logo">NETWORK ACTIVITIES</div>

      <div className="feed-media-container">
        {hasVideo ? (
          <video
            key={videoSource}
            className="feed-video"
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
            className="feed-image"
            src={imageSource}
            alt={currentActivity.activity_title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
            }}
          />
        )}
      </div>

      <div className="feed-overlay">
        <div className="feed-left-col">
          <h2 className="feed-title">{currentActivity.activity_title}</h2>
          <div className={`feed-desc ${expandedDesc ? '' : 'collapsed'}`}>
            {currentActivity.activity_description}
          </div>
          <button
            type="button"
            className="feed-more-btn"
            onClick={() => setExpandedDesc(!expandedDesc)}
          >
            {expandedDesc ? 'Свернуть' : 'Еще'}
          </button>
        </div>

        <div className="feed-right-col">
          {/* Likes */}
          <div
            className="feed-action-item"
            onClick={() => toggleLike(currentActivity.id)}
            title="Поставить отметку нравится"
          >
            <svg
              width="28"
              height="24"
              viewBox="0 0 16 14"
              fill={currentLikeInfo.liked ? '#FF4B72' : 'none'}
              stroke="#FF4B72"
              strokeWidth="1.5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1.64547 2.59989C1.22508 3.21118 1.00001 3.9356 1 4.67747C1 6.21082 2.00008 7.34416 3.00015 8.34417L6.67244 11.8989C6.79846 12.04 6.95307 12.1526 7.126 12.2294C7.29892 12.3061 7.48619 12.3452 7.67537 12.344C7.86456 12.3428 8.05132 12.3013 8.22325 12.2224C8.39519 12.1435 8.54836 12.0289 8.67259 11.8862L12.3342 8.34417C13.3343 7.34416 14.3344 6.20415 14.3344 4.67747C14.3379 3.93397 14.1149 3.20702 13.6951 2.59339C13.2752 1.97975 12.6784 1.50852 11.9841 1.24243C11.2898 0.976333 10.5309 0.927992 9.80843 1.10384C9.08597 1.27968 8.4342 1.67138 7.93987 2.22678C7.90494 2.26412 7.86271 2.29389 7.81581 2.31425C7.7689 2.3346 7.71831 2.3451 7.66718 2.3451C7.61605 2.3451 7.56546 2.3346 7.51855 2.31425C7.47164 2.29389 7.42942 2.26412 7.39449 2.22678C6.8986 1.67496 6.24698 1.28653 5.52569 1.1128C4.8044 0.939065 4.04737 0.988196 3.35459 1.2537C2.66181 1.51921 2.06586 1.98861 1.64547 2.59989Z" />
            </svg>
            <span className="feed-action-text">{currentLikeInfo.count}</span>
          </div>

          {/* Average Traffic Parameter */}
          <div className="feed-param" title="Средний трафик">
            <span className="feed-param-icon">⚡</span>
            <span className="feed-param-val">{currentActivity.average_traffic_mbps} Мбит/с</span>
          </div>

          {/* Max Latency Parameter */}
          <div className="feed-param" title="Максимальная задержка">
            <span className="feed-param-icon">⏱</span>
            <span className="feed-param-val">{currentActivity.max_latency_ms} мс</span>
          </div>

          {/* Next Button */}
          <button
            type="button"
            className="btn-next-circle"
            onClick={handleNext}
            title="Следующая активность"
          >
            <svg width="14" height="14" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 5.0838H9.1676M5.0838 9.1676L9.1676 5.0838L5.0838 1"
                stroke="#00F3BB"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
