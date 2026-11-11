import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FeedPage } from '../pages/FeedPage';
import { CatalogPage } from '../pages/CatalogPage';
import { DetailPage } from '../pages/DetailPage';
import { AddPage } from '../pages/AddPage';
import { AuthPage } from '../pages/AuthPage';
import { BottomNavbar } from '../widgets/bottom-navbar/BottomNavbar';
import { LoadingOverlay } from '../shared/ui/LoadingOverlay/LoadingOverlay';
import { ROUTES } from './routes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <main className="app-content">
          <Routes>
            {/* Тематические маршруты по доменной модели Network Activities */}
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.FEED} replace />} />
            <Route path={ROUTES.FEED} element={<FeedPage />} />
            <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
            <Route path="/network-activities/catalog" element={<Navigate to={ROUTES.CATALOG} replace />} />
            <Route path={ROUTES.DRAFT} element={<AddPage />} />
            <Route path="/network-activities/add" element={<Navigate to={ROUTES.DRAFT} replace />} />
            <Route path={ROUTES.AUTH} element={<AuthPage />} />
            <Route path="/users/login" element={<Navigate to={ROUTES.AUTH} replace />} />
            <Route path={`${ROUTES.DETAIL}/:id`} element={<DetailPage />} />

            {/* Алиасы со старых путей для совместимости */}
            <Route path="/feed" element={<Navigate to={ROUTES.FEED} replace />} />
            <Route path="/catalog" element={<Navigate to={ROUTES.CATALOG} replace />} />
            <Route path="/draft" element={<Navigate to={ROUTES.DRAFT} replace />} />
            <Route path="/add" element={<Navigate to={ROUTES.DRAFT} replace />} />
            <Route path="/login" element={<Navigate to={ROUTES.AUTH} replace />} />
            <Route path="/auth" element={<Navigate to={ROUTES.AUTH} replace />} />

            {/* Fallback на тематическую ленту */}
            <Route path="*" element={<Navigate to={ROUTES.FEED} replace />} />
          </Routes>
        </main>

        {/* Анимация блокировки при AJAX-запросах к сервису */}
        <LoadingOverlay />

        {/* Нижняя навигационная панель */}
        <BottomNavbar />
      </div>
    </BrowserRouter>
  );
};

export default App;
