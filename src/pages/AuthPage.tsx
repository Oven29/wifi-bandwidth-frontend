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

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Валидация перед отправкой
  const validateForm = (): string | null => {
    const trimmedUser = username.trim();
    if (!trimmedUser) {
      return 'Пожалуйста, укажите имя пользователя';
    }
    if (trimmedUser.length < 3) {
      return 'Логин должен содержать не менее 3 символов';
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUser)) {
      return 'Логин может содержать только латинские буквы, цифры, дефис и подчеркивание';
    }

    if (!password) {
      return 'Пожалуйста, введите пароль';
    }
    if (password.length < 6) {
      return 'Пароль должен содержать не менее 6 символов';
    }

    if (mode === 'register') {
      if (!confirmPassword) {
        return 'Пожалуйста, повторите пароль';
      }
      if (password !== confirmPassword) {
        return 'Введенные пароли не совпадают';
      }
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

      if (mode === 'register') {
        // Регистрация нового пользователя через Axios (Лекция 10-11)
        await authApi.register(trimmedUser, password);
        // Сразу производим авторизацию созданного пользователя
        await authApi.login(trimmedUser, password);
      } else {
        // Авторизация пользователя через Axios
        await authApi.login(trimmedUser, password);
      }

      // Вручную передаем состояние в Redux
      dispatch(loginSuccess({ username: trimmedUser }));
      navigate(ROUTES.CATALOG);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      let msg = 'Произошла ошибка при выполнении запроса';
      if (typeof detail === 'string') {
        if (detail.includes('already registered')) {
          msg = 'Пользователь с таким логином уже зарегистрирован';
        } else {
          msg = detail;
        }
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

  const handleModeSwitch = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setValidationError(null);
    dispatch(setAuthError(null));
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
            {isAuthenticated
              ? 'Вы авторизованы'
              : mode === 'login'
              ? 'Вход в систему'
              : 'Регистрация аккаунта'}
          </h1>
          <p className="auth-subtitle">
            {isAuthenticated
              ? `Текущий пользователь: @${currentUsername}`
              : mode === 'login'
              ? 'Авторизуйтесь для управления активностями роутера'
              : 'Создайте аккаунт для добавления своих услуг'}
          </p>
        </div>

        {!isAuthenticated && (
          <div className="auth-tabs mb-4">
            <button
              type="button"
              className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => handleModeSwitch('login')}
            >
              Вход
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => handleModeSwitch('register')}
            >
              Регистрация
            </button>
          </div>
        )}

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
              {mode === 'register' && (
                <div className="auth-validation-hint">
                  Минимум 3 символа (латиница, цифры, дефис, подчеркивание)
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="auth-label">Пароль</Form.Label>
              <div className="auth-password-wrapper">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  className="custom-form-control auth-password-input"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
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
                    // Иконка перечеркнутого глаза (скрыть)
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    // Иконка открытого глаза (показать)
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {mode === 'register' && (
                <div className="auth-validation-hint">
                  Минимум 6 символов
                </div>
              )}
            </Form.Group>

            {mode === 'register' && (
              <Form.Group className="mb-4">
                <Form.Label className="auth-label">Подтверждение пароля</Form.Label>
                <div className="auth-password-wrapper">
                  <Form.Control
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="custom-form-control auth-password-input"
                    placeholder="Повторите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    title={showConfirmPassword ? 'Скрыть пароль' : 'Показать пароль'}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
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
            )}

            <Button
              type="submit"
              className="btn-auth-submit w-100 mb-3 py-2"
              disabled={loading}
            >
              {loading
                ? mode === 'login'
                  ? 'Проверка...'
                  : 'Регистрация...'
                : mode === 'login'
                ? 'Войти в аккаунт'
                : 'Создать аккаунт'}
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
};
