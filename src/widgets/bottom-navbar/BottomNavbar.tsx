import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { ROUTES } from '../../app/routes';
import '../../styles/widgets/BottomNavbar.css';

export const BottomNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isFeed = location.pathname === ROUTES.HOME || location.pathname === ROUTES.FEED;
  const isCatalog = location.pathname === ROUTES.CATALOG;

  return (
    <Navbar className="bottom-navbar" fixed="bottom">
      <Nav className="w-100 d-flex flex-row justify-content-around">
        {/* Пункт 1: Лента (ДОСТУПЕН) */}
        <Nav.Item className="flex-fill">
          <button
            type="button"
            className={`bottom-tab-item w-100 ${isFeed ? 'active' : ''}`}
            onClick={() => navigate(ROUTES.FEED)}
          >
            <span className="bottom-tab-icon">
              <svg width="19" height="13" viewBox="0 0 19 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13 7.5L17.5 10.5V2.5L13 5.5M2 1.5H11C11.5523 1.5 12 1.94772 12 2.5V10.5C12 11.0523 11.5523 11.5 11 11.5H2C1.44772 11.5 1 11.0523 1 10.5V2.5C1 1.94772 1.44772 1.5 2 1.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="tab-label">Лента</span>
          </button>
        </Nav.Item>

        {/* Пункт 2: Добавление (НЕДОСТУПЕН ДЛЯ ГОСТЯ ПО ЗАДАНИЮ ЛР5) */}
        <Nav.Item className="flex-fill">
          <button
            type="button"
            className="bottom-tab-item disabled w-100"
            disabled
          >
            <span className="bottom-tab-icon">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1.5 7.5H13.5M7.5 1.5V13.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="tab-label">Добавление</span>
          </button>
        </Nav.Item>

        {/* Пункт 3: Плитка (ДОСТУПЕН) */}
        <Nav.Item className="flex-fill">
          <button
            type="button"
            className={`bottom-tab-item w-100 ${isCatalog ? 'active' : ''}`}
            onClick={() => navigate(ROUTES.CATALOG)}
          >
            <span className="bottom-tab-icon">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.8" />
                <rect x="9" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.8" />
                <rect x="1" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.8" />
                <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </span>
            <span className="tab-label">Плитка</span>
          </button>
        </Nav.Item>

        {/* Пункт 4: Вход (НЕДОСТУПЕН ДЛЯ ГОСТЯ ПО ЗАДАНИЮ ЛР5) */}
        <Nav.Item className="flex-fill">
          <button
            type="button"
            className="bottom-tab-item disabled w-100"
            disabled
          >
            <span className="bottom-tab-icon">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7.5" cy="4.5" r="3" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M1.5 13.5C1.5 10.7386 4.18629 8.5 7.5 8.5C10.8137 8.5 13.5 10.7386 13.5 13.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="tab-label">Вход</span>
          </button>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};
