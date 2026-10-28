import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import './BottomNavbar.css';

export const BottomNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isFeed = location.pathname === ROUTES.HOME || location.pathname === ROUTES.FEED;
  const isCatalog = location.pathname === ROUTES.CATALOG;

  return (
    <Navbar className="bottom-navbar" fixed="bottom">
      <Nav className="w-100 d-flex flex-row justify-content-around">
        {/* Item 1: Лента (Accessible) */}
        <Nav.Item className="flex-fill">
          <button
            type="button"
            className={`bottom-tab-item w-100 ${isFeed ? 'active' : ''}`}
            onClick={() => navigate(ROUTES.FEED)}
            title="Лента активностей"
          >
            <span className="tab-icon">
              <svg width="19" height="12" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.6676 6.83355L17.0204 9.73522C17.0832 9.77698 17.1561 9.80093 17.2314 9.80453C17.3067 9.80813 17.3815 9.79124 17.448 9.75567C17.5144 9.7201 17.57 9.66717 17.6087 9.60252C17.6475 9.53787 17.6679 9.46392 17.668 9.38855V2.55855C17.668 2.48524 17.6487 2.41322 17.612 2.34976C17.5752 2.2863 17.5224 2.23366 17.4589 2.19714C17.3953 2.16062 17.3232 2.14152 17.2499 2.14177C17.1765 2.14202 17.1046 2.1616 17.0413 2.19855L12.6676 4.75022M2.66678 1H11.0008C11.9213 1 12.6676 1.74619 12.6676 2.66667V9.33333C12.6676 10.2538 11.9213 11 11.0008 11H2.66678C1.74624 11 0.999985 10.2538 0.999985 9.33333V2.66667C0.999985 1.74619 1.74624 1 2.66678 1Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span>{ROUTE_LABELS.FEED}</span>
          </button>
        </Nav.Item>

        {/* Item 2: Добавление (DISABLED for guest) */}
        <Nav.Item className="flex-fill">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip-add-disabled">Доступно только авторизованным пользователям</Tooltip>}
          >
            <span className="d-block w-100">
              <button
                type="button"
                className="bottom-tab-item disabled w-100"
                disabled
                aria-disabled="true"
              >
                <span className="tab-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M0.999985 6.834H12.668M6.83398 1V12.668"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span>{ROUTE_LABELS.DRAFT}</span>
              </button>
            </span>
          </OverlayTrigger>
        </Nav.Item>

        {/* Item 3: Плитка (Accessible) */}
        <Nav.Item className="flex-fill">
          <button
            type="button"
            className={`bottom-tab-item w-100 ${isCatalog ? 'active' : ''}`}
            onClick={() => navigate(ROUTES.CATALOG)}
            title="Каталог (плитка)"
          >
            <span className="tab-icon">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.5 1V16M1 8.5H16M2.66667 1H14.3333C15.2538 1 16 1.74619 16 2.66667V14.3333C16 15.2538 15.2538 16 14.3333 16H2.66667C1.74619 16 1 15.2538 1 14.3333V2.66667C1 1.74619 1.74619 1 2.66667 1Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span>{ROUTE_LABELS.CATALOG}</span>
          </button>
        </Nav.Item>

        {/* Item 4: Вход (DISABLED for guest) */}
        <Nav.Item className="flex-fill">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip-login-disabled">Режим гостя: вход отключен</Tooltip>}
          >
            <span className="d-block w-100">
              <button
                type="button"
                className="bottom-tab-item disabled w-100"
                disabled
                aria-disabled="true"
              >
                <span className="tab-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                </span>
                <span>{ROUTE_LABELS.LOGIN}</span>
              </button>
            </span>
          </OverlayTrigger>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};
