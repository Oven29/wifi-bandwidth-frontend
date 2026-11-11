import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FeedPage } from '../pages/FeedPage';
import { CatalogPage } from '../pages/CatalogPage';
import { DetailPage } from '../pages/DetailPage';
import { BottomNavbar } from '../widgets/bottom-navbar/BottomNavbar';
import { ROUTES } from './routes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <main className="app-content">
          <Routes>
            <Route path={ROUTES.HOME} element={<FeedPage />} />
            <Route path={ROUTES.FEED} element={<FeedPage />} />
            <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
            <Route path={`${ROUTES.DETAIL}/:id`} element={<DetailPage />} />
            <Route path="*" element={<Navigate to={ROUTES.FEED} replace />} />
          </Routes>
        </main>
        {/* Нижняя навигационная панель (4 пункта, 2 доступны для гостя) */}
        <BottomNavbar />
      </div>
    </BrowserRouter>
  );
};

export default App;
