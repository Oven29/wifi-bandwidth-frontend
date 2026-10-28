import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { NetworkActivity } from '../../types/activity';
import { DEFAULT_IMAGE } from '../../modules/mock';
import './ActivityCard.css';

interface ActivityCardProps {
  activity: NetworkActivity;
  onClick: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onClick }) => {
  const [imageSrc, setImageSrc] = useState<string>(
    activity.preview_image_url || DEFAULT_IMAGE
  );

  const handleImageError = () => {
    // If specific preview image fails to load, fallback to default image in project
    setImageSrc(DEFAULT_IMAGE);
  };

  return (
    <Card className="activity-card h-100" onClick={onClick}>
      <div className="activity-card-img-wrapper">
        <Card.Img
          variant="top"
          src={imageSrc}
          alt={activity.activity_title}
          onError={handleImageError}
          className="activity-card-img"
        />
      </div>
      <Card.Body className="activity-card-body">
        <div>
          <div className="activity-card-meta">
            <span className="activity-card-latency">⏱ {activity.max_latency_ms} мс</span>
            <span className="activity-card-likes">♡ {activity.likes_count}</span>
          </div>
          <Card.Title as="h3" className="activity-card-title">
            {activity.activity_title}
          </Card.Title>
        </div>
        <div className="activity-card-speed">
          ⚡ {activity.average_traffic_mbps} Мбит/с
        </div>
      </Card.Body>
    </Card>
  );
};
