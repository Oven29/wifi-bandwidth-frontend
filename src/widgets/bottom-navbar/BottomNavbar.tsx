import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { authApi } from '../../shared/api/authApi';
import { logoutSuccess } from '../../features/auth/model/authSlice';
import { resetFilters } from '../../features/activity-filter/model/filterSlice';
import { ROUTES } from '../../app/routes';
import '../../styles/widgets/BottomNavbar.css';

export const BottomNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Состояние авторизации из Redux Toolkit (Скриншот 9)
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const isFeed = location.pathname === ROUTES.HOME || location.pathname === ROUTES.FEED;
  const isCatalog = location.pathname === ROUTES.CATALOG;
  const isAdd = location.pathname === ROUTES.ADD;
  const isLogin = location.pathname === ROUTES.LOGIN;

  const handleLogout = async () => {
    // 1. Ручной вызов деавторизации через Axios
    await authApi.logout();
    // 2. Сброс состояния авторизации в Redux
    dispatch(logoutSuccess());
    // 3. Сброс фильтра пользователя (требование задания: "При выходе должен сбрасываться фильтр пользователя")
    dispatch(resetFilters());
    // 4. Переход на главную страницу ленты
    navigate(ROUTES.FEED);
  };

  return (
    <Navbar className="bottom-navbar" fixed="bottom">
      <Nav className="w-100 d-flex flex-row justify-content-around">
        {/* Пункт 1: Лента */}
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

        {/* Пункт 2: Добавление (доступно только авторизованному пользователю) */}
        <Nav.Item className="flex-fill">
          {isAuthenticated ? (
            <button
              type="button"
              className={`bottom-tab-item w-100 ${isAdd ? 'active' : ''}`}
              onClick={() => navigate(ROUTES.ADD)}
              title="Создать новую активность"
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
          ) : (
            <button
              type="button"
              className="bottom-tab-item disabled w-100"
              disabled
              title="Доступно только авторизованным пользователям"
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
          )}
        </Nav.Item>

        {/* Пункт 3: Плитка */}
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

        {/* Пункт 4: Вход / Выход (переключение между гостем и пользователем) */}
        <Nav.Item className="flex-fill">
          {isAuthenticated ? (
            <button
              type="button"
              className="bottom-tab-item w-100 text-danger-hover"
              onClick={handleLogout}
              title="Выйти из аккаунта (сброс сессии)"
            >
              <span className="bottom-tab-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 17L21 12L16 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12H9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="tab-label">Выход</span>
            </button>
          ) : (
            <button
              type="button"
              className={`bottom-tab-item w-100 ${isLogin ? 'active' : ''}`}
              onClick={() => navigate(ROUTES.LOGIN)}
              title="Войти в систему"
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
          )}
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};
