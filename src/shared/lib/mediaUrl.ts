/**
 * Преобразует прямой URL MinIO (http://localhost:9000/media/...)
 * в проксируемый путь (/media/...), чтобы браузер запрашивал медиа через :3000 (Vite proxy -> MinIO :9000).
 */
export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Переписываем прямые ссылки на локальный MinIO в путь прокси /media/...
  const minioPrefixMatch = trimmed.match(/^https?:\/\/(?:localhost|127\.0\.0\.1):9000(\/.*)$/i);
  if (minioPrefixMatch) {
    return minioPrefixMatch[1];
  }

  // Если указан только ключ файла (без http и без ведущего слеша) — направляем в бакет /media/
  if (!/^https?:\/\//i.test(trimmed) && !trimmed.startsWith('/') && !trimmed.startsWith('data:') && !trimmed.startsWith('blob:')) {
    return `/media/${trimmed}`;
  }

  return trimmed;
}
