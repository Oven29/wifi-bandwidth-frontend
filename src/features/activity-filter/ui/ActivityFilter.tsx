import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ActivityFilterParams } from '../../../entities/activity/model/types';
import '../../../styles/features/ActivityFilter.css';

interface ActivityFilterProps {
  initialFilters: ActivityFilterParams;
  onApply: (filters: ActivityFilterParams) => void;
  onReset: () => void;
}

export const ActivityFilter: React.FC<ActivityFilterProps> = ({
  initialFilters,
  onApply,
  onReset,
}) => {
  // Локальное состояние полей ввода до нажатия кнопки "Поиск" (Скриншоты 5-6, Лекция 9 слайд 6)
  const [searchValue, setSearchValue] = useState<string>(initialFilters.search);
  const [trafficValue, setTrafficValue] = useState<number>(initialFilters.maxTraffic);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({
      search: searchValue,
      maxTraffic: trafficValue,
    });
  };

  const handleReset = () => {
    setSearchValue('');
    setTrafficValue(150);
    onReset();
  };

  return (
    <div className="filter-card">
      <Form onSubmit={handleSubmit}>
        {/* Поле текстового поиска по названию/описанию */}
        <Form.Group className="search-input-group">
          <span className="search-icon">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13.5 13.5L10.5 10.5M12 6.5C12 9.53757 9.53757 12 6.5 12C3.46243 12 1 9.53757 1 6.5C1 3.46243 3.46243 1 6.5 1C9.53757 1 12 3.46243 12 6.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <Form.Control
            type="text"
            className="custom-form-control"
            placeholder="Поиск по названию активности..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Form.Group>

        {/* Фильтр по объему трафика (React-Bootstrap Form.Range) */}
        <Form.Group className="mb-3">
          <Form.Label className="filter-label">
            <span>Максимальный трафик:</span>
            <span className="filter-badge-val">{trafficValue} Мбит/с</span>
          </Form.Label>
          <Form.Range
            min={0}
            max={150}
            step={5}
            value={trafficValue}
            onChange={(e) => setTrafficValue(Number(e.target.value))}
          />
          <div className="slider-limits">
            <span>0</span>
            <span>75</span>
            <span>150 Мбит/с</span>
          </div>
        </Form.Group>

        {/* Кнопки управления поиском */}
        <Row className="g-2">
          <Col xs={7}>
            <Button type="submit" className="btn-filter-apply w-100">
              Найти активности
            </Button>
          </Col>
          <Col xs={5}>
            <Button
              type="button"
              onClick={handleReset}
              className="btn-filter-reset w-100"
            >
              Сбросить
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
