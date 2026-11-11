import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import {
  fetchDraftThunk,
  createDraftThunk,
  publishActivityThunk,
  clearDraft,
} from '../entities/activity/model/activitySlice';
import { ROUTES } from '../app/routes';
import '../styles/pages/AddPage.css';

export const AddPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { draft, loading, error } = useAppSelector((state) => state.activity);

  // Шаг 1: Создание черновика
  const [title, setTitle] = useState<string>('');
  const [picFile, setPicFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Шаг 2: Публикация черновика
  const [description, setDescription] = useState<string>('');
  const [traffic, setTraffic] = useState<number>(35);
  const [latency, setLatency] = useState<number>(25);

  const [formError, setFormError] = useState<string | null>(null);

  // Проверка существующего черновика пользователя при входе
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchDraftThunk());
    }
  }, [isAuthenticated, dispatch]);

  // Заполнение полей второго шага, если получен существующий черновик
  useEffect(() => {
    if (draft) {
      setTitle(draft.activity_title || '');
      setDescription(draft.activity_description || '');
      if (draft.average_traffic_mbps) setTraffic(draft.average_traffic_mbps);
      if (draft.max_latency_ms) setLatency(draft.max_latency_ms);
    }
  }, [draft]);

  if (!isAuthenticated) {
    return (
      <div className="add-page">
        <div className="add-auth-required-box text-center">
          <div className="add-lock-icon">🔒</div>
          <h2 className="mb-2">Требуется авторизация</h2>
          <p className="text-secondary mb-4">
            Создание новых профилей сетевой активности роутера доступно только авторизованным пользователям.
          </p>
          <Button
            className="btn-auth-redirect w-100 py-2"
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Войти в аккаунт
          </Button>
        </div>
      </div>
    );
  }

  // Обработка Шага 1: Загрузка медиа в MinIO и создание черновика
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Укажите название профиля сетевой активности');
      return;
    }
    if (!picFile) {
      setFormError('Выберите превью-изображение (PNG, JPG, SVG)');
      return;
    }
    if (!videoFile) {
      setFormError('Выберите демонстрационный видеоролик (MP4, WebM)');
      return;
    }

    const result = await dispatch(
      createDraftThunk({
        title: title.trim(),
        pic: picFile,
        video: videoFile,
      })
    );

    if (createDraftThunk.rejected.match(result)) {
      setFormError((result.payload as string) || 'Не удалось создать черновик');
    }
  };

  // Обработка Шага 2: Публикация черновика в общий каталог
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setFormError(null);

    if (!description.trim()) {
      setFormError('Заполните описание сетевого сценария');
      return;
    }

    const result = await dispatch(
      publishActivityThunk({
        id: draft.id,
        data: {
          activity_description: description.trim(),
          average_traffic_mbps: traffic,
          max_latency_ms: latency,
        },
      })
    );

    if (publishActivityThunk.fulfilled.match(result)) {
      dispatch(clearDraft());
      navigate(ROUTES.CATALOG);
    } else {
      setFormError((result.payload as string) || 'Ошибка публикации активности');
    }
  };

  return (
    <div className="add-page">
      <div className="add-card">
        <div className="add-header">
          <h1 className="add-title">
            {draft ? 'Шаг 2: Публикация услуги' : 'Шаг 1: Создание услуги'}
          </h1>
          <ProgressBar
            now={draft ? 100 : 50}
            className="add-progress mb-3"
            variant="success"
          />
        </div>

        {(formError || error) && (
          <Alert variant="danger" className="py-2 text-center add-alert">
            {formError || error}
          </Alert>
        )}

        {!draft ? (
          // Форма Шага 1
          <Form onSubmit={handleStep1Submit}>
            <Form.Group className="mb-3">
              <Form.Label className="add-label">Название активности</Form.Label>
              <Form.Control
                type="text"
                className="custom-form-control"
                placeholder="Например: Облачный VR-стриминг"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="add-label">
                Превью-изображение (в MinIO / Silo)
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                className="custom-file-input"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files?.[0]) setPicFile(e.target.files[0]);
                }}
                disabled={loading}
              />
              <Form.Text className="text-secondary small">
                Будет загружено в S3-хранилище MinIO
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="add-label">
                Превью-видеоролик (в MinIO / Silo)
              </Form.Label>
              <Form.Control
                type="file"
                accept="video/*"
                className="custom-file-input"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files?.[0]) setVideoFile(e.target.files[0]);
                }}
                disabled={loading}
              />
              <Form.Text className="text-secondary small">
                Видеофайл для полноэкранного плеера в Ленте
              </Form.Text>
            </Form.Group>

            <Button
              type="submit"
              className="btn-add-submit w-100 py-2"
              disabled={loading}
            >
              {loading ? 'Загрузка в MinIO...' : 'Создать черновик →'}
            </Button>
          </Form>
        ) : (
          // Форма Шага 2
          <Form onSubmit={handleStep2Submit}>
            <div className="draft-preview-badge mb-3">
              <span>Черновик #{draft.id}:</span>
              <strong>{draft.activity_title}</strong>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="add-label">Описание сетевого профиля</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                className="custom-form-control"
                placeholder="Подробное описание требований к сетевому каналу роутера..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="add-label d-flex justify-content-between">
                <span>Средний трафик:</span>
                <span className="text-accent">{traffic} Мбит/с</span>
              </Form.Label>
              <Form.Range
                min={1}
                max={150}
                step={1}
                value={traffic}
                onChange={(e) => setTraffic(Number(e.target.value))}
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="add-label d-flex justify-content-between">
                <span>Максимальная задержка (пинг):</span>
                <span className="text-accent">{latency} мс</span>
              </Form.Label>
              <Form.Range
                min={1}
                max={500}
                step={5}
                value={latency}
                onChange={(e) => setLatency(Number(e.target.value))}
                disabled={loading}
              />
            </Form.Group>

            <Button
              type="submit"
              className="btn-add-submit w-100 mb-2 py-2"
              disabled={loading}
            >
              {loading ? 'Публикация...' : 'Опубликовать в каталоге ✓'}
            </Button>

            <Button
              variant="outline-secondary"
              className="w-100 py-2"
              onClick={() => dispatch(clearDraft())}
              disabled={loading}
            >
              Отменить черновик
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
};
