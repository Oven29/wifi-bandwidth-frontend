import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { setFilters, resetFilters } from '../model/filterSlice';
import '../../../styles/features/ActivityFilter.css';

interface ActivityFilterProps {
  onApplyFilters?: (filters: { search: string; maxTraffic: number }) => void;
}

export const ActivityFilter: React.FC<ActivityFilterProps> = ({ onApplyFilters }) => {
  const dispatch = useAppDispatch();
  const reduxFilters = useAppSelector((state) => state.filter);

  // Локальный буфер формы до момента нажатия кнопки отправки (onSubmit)
  const [searchValue, setSearchValue] = useState<string>(reduxFilters.search);
  const [trafficValue, setTrafficValue] = useState<number>(reduxFilters.maxTraffic);

  // Синхронизация локальных значений при внешнем сбросе фильтра в Redux (например, при логауте)
  useEffect(() => {
    setSearchValue(reduxFilters.search);
    setTrafficValue(reduxFilters.maxTraffic);
  }, [reduxFilters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters = {
      search: searchValue,
      maxTraffic: trafficValue,
    };
    // Сохраняем в Redux Toolkit
    dispatch(setFilters(newFilters));
    onApplyFilters?.(newFilters);
  };

  const handleReset = () => {
    setSearchValue('');
    setTrafficValue(150);
    dispatch(resetFilters());
    onApplyFilters?.({ search: '', maxTraffic: 150 });
  };

  return (
    <div className="filter-card">
      <Form onSubmit={handleSubmit}>
        {/* Поле текстового поиска по названию */}
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

        {/* Фильтр по объему трафика */}
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

        {/* Кнопки управления */}
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
