import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useAppSelector } from '../../../app/store/hooks';
import '../../../styles/shared/LoadingOverlay.css';

export const LoadingOverlay: React.FC = () => {
  const activityLoading = useAppSelector((state) => state.activity.loading);
  const authLoading = useAppSelector((state) => state.auth.loading);

  const isLoading = activityLoading || authLoading;

  if (!isLoading) return null;

  return (
    <div className="blocking-loading-overlay">
      <div className="loading-content-box">
        <Spinner animation="border" variant="primary" className="loading-spinner" />
        <div className="loading-text">Выполнение запроса...</div>
        <div className="loading-subtext">Пожалуйста, подождите</div>
      </div>
    </div>
  );
};
