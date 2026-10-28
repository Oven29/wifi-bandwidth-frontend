import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { FeedPage } from './pages/FeedPage';
import { CatalogPage } from './pages/CatalogPage';
import { DetailPage } from './pages/DetailPage';
import { ROUTES } from './Routes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.HOME} element={<FeedPage />} />
          <Route path={ROUTES.FEED} element={<FeedPage />} />
          <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
          <Route path={`${ROUTES.DETAIL}/:id`} element={<DetailPage />} />
          <Route path="*" element={<Navigate to={ROUTES.FEED} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
