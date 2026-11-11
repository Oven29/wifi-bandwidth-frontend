import axios from 'axios';

/**
 * Ручное взаимодействие с эндпоинтами авторизации/деавторизации через Axios
 * (по требованию ЛР №6: "Для запросов авторизации/деавторизации только axios,
 * вручную передавать состояние в Redux без кодогенерации и thunk").
 */

export interface AuthSuccessResponse {
  message: string;
  session_id: string;
}

export const authApi = {
  /**
   * Авторизация пользователя по username/password.
   * Отправляет application/x-www-form-urlencoded запрос на /api/users/auth.
   */
  async login(username: string, password: string): Promise<AuthSuccessResponse> {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    const response = await axios.post<AuthSuccessResponse>('/api/users/auth', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      withCredentials: true,
    });

    if (response.data.session_id) {
      localStorage.setItem('session_id', response.data.session_id);
      localStorage.setItem('username', username);
      // Устанавливаем cookie для отчета и Postman (Скриншоты 9-10)
      document.cookie = `session_id=${response.data.session_id}; path=/; SameSite=Lax`;
    }

    return response.data;
  },

  /**
   * Деавторизация пользователя (POST /api/users/logout).
   * Очищает Redis-сессию на бэкенде, cookie и localStorage.
   */
  async logout(): Promise<void> {
    try {
      await axios.post(
        '/api/users/logout',
        {},
        {
          withCredentials: true,
        }
      );
    } catch {
      // Игнорируем сетевые ошибки при выходе, чтобы гарантированно сбросить локальное состояние
    } finally {
      localStorage.removeItem('session_id');
      localStorage.removeItem('username');
      document.cookie = 'session_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  },

  /**
   * Проверка наличия сохраненной сессии в localStorage
   */
  getStoredAuth(): { isAuthenticated: boolean; username: string | null } {
    const sessionId = localStorage.getItem('session_id');
    const username = localStorage.getItem('username');
    return {
      isAuthenticated: Boolean(sessionId),
      username: username || null,
    };
  },
};
