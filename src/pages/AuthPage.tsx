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

  const [username, setUsername] = useState<string>('ivan_test');
  const [password, setPassword] = useState<string>('secret_password');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      dispatch(setAuthError('Пожалуйста, введите имя пользователя и пароль'));
      return;
    }

    try {
      dispatch(setAuthLoading(true));
      dispatch(setAuthError(null));

      // Ручной вызов Axios без thunk (требование ЛР6)
      await authApi.login(username.trim(), password.trim());

      // Передаем состояние в Redux вручную
      dispatch(loginSuccess({ username: username.trim() }));
      navigate(ROUTES.CATALOG);
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Неверный логин или пароль';
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
              : 'Авторизуйтесь для создания и удаления услуг роутера'}
          </p>
        </div>

        {error && (
          <Alert variant="danger" className="auth-alert py-2 text-center">
            {error}
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
                placeholder="ivan_test"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="auth-label">Пароль</Form.Label>
              <Form.Control
                type="password"
                className="custom-form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
            </Form.Group>

            <Button
              type="submit"
              className="btn-auth-submit w-100 mb-3 py-2"
              disabled={loading}
            >
              {loading ? 'Проверка...' : 'Войти в аккаунт'}
            </Button>

            <div className="auth-hint">
              <span>Тестовый аккаунт бэкенда:</span>
              <code>ivan_test / secret_password</code>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};
