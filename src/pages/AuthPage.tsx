import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import { authApi } from '../shared/api/authApi';
import { setAuthLoading, loginSuccess, setAuthError } from '../features/auth/model/authSlice';
import { ROUTES } from '../app/routes';
import '../styles/pages/AuthPage.css';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, username: currentUsername, error, loading } = useAppSelector(
    (state) => state.auth
  );

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateForm = (): string | null => {
    const trimmedUser = username.trim();
    if (!trimmedUser) {
      return 'Пожалуйста, укажите имя пользователя';
    }
    if (!password) {
      return 'Пожалуйста, введите пароль';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    dispatch(setAuthError(null));

    const err = validateForm();
    if (err) {
      setValidationError(err);
      return;
    }

    const trimmedUser = username.trim();

    try {
      dispatch(setAuthLoading(true));
      await authApi.login(trimmedUser, password);
      dispatch(loginSuccess({ username: trimmedUser }));
      navigate(ROUTES.CATALOG);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      let msg = 'Произошла ошибка при выполнении запроса';
      if (typeof detail === 'string') {
        msg = detail;
      } else if (err.response?.status === 401) {
        msg = 'Неверный логин или пароль';
      }
      dispatch(setAuthError(msg));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(setAuthLoading(true));
      await authApi.logout();
      dispatch({ type: 'auth/logoutSuccess' });
      dispatch({ type: 'filter/resetFilters' });
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className="auth-title">
            {isAuthenticated ? 'Вы авторизованы' : 'Вход в систему'}
          </h1>
          <p className="auth-subtitle">
            {isAuthenticated
              ? `Текущий пользователь: @${currentUsername}`
              : 'Авторизуйтесь для управления активностями роутера'}
          </p>
        </div>

        {(validationError || error) && (
          <Alert variant="danger" className="auth-alert py-2 text-center">
            {validationError || error}
          </Alert>
        )}

        {isAuthenticated ? (
          <div className="auth-logged-in-box">
            <div className="auth-session-info">
              <span>Сессия активна:</span>
              <code>{localStorage.getItem('session_id') || 'session_id cookie'}</code>
            </div>
            <Button
              variant="outline-danger"
              className="w-100 mb-2 py-2"
              onClick={handleLogout}
              disabled={loading}
            >
              Выйти из аккаунта
            </Button>
            <Button
              variant="outline-light"
              className="w-100 py-2"
              onClick={() => navigate(ROUTES.CATALOG)}
            >
              Перейти в каталог
            </Button>
          </div>
        ) : (
          <Form onSubmit={handleSubmit} className="auth-form">
            <Form.Group className="mb-3">
              <Form.Label className="auth-label">Логин (Username)</Form.Label>
              <Form.Control
                type="text"
                className="custom-form-control"
                placeholder="Введите логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="auth-label">Пароль</Form.Label>
              <div className="auth-password-wrapper">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  className="custom-form-control auth-password-input"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </Form.Group>

            <Button
              type="submit"
              className="btn-auth-submit w-100 mb-3 py-2"
              disabled={loading}
            >
              {loading ? 'Проверка...' : 'Войти в аккаунт'}
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
};
