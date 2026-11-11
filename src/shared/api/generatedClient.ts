import { Api } from './generated/Api';

/**
 * Экземпляр кодогенерированного клиента API (7 методов домена услуг),
 * настроенный на работу через прокси Vite (/api) с передачей Cookie (withCredentials: true).
 */
export const generatedApi = new Api({
  baseURL: '',
  withCredentials: true,
});

/**
 * 7 сгенерированных методов домена услуг (Network Activities)
 */
export const networkActivitiesApi = generatedApi.api;
