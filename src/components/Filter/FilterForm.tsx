import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ActivityFilterParams, SortOption } from '../../types/activity';
import './FilterForm.css';

interface FilterFormProps {
  filters: ActivityFilterParams;
  onChange: (newFilters: ActivityFilterParams) => void;
  onReset: () => void;
}

export const FilterForm: React.FC<FilterFormProps> = ({ filters, onChange, onReset }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleTrafficChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, maxTraffic: Number(e.target.value) });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, sortBy: e.target.value as SortOption });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="filter-card">
      <Form onSubmit={handleSubmit}>
        {/* Search Input */}
        <Form.Group className="search-input-group">
          <span className="search-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13.0001 13.0001L10.1068 10.1068M11.6667 6.33333C11.6667 9.27885 9.27885 11.6667 6.33333 11.6667C3.38781 11.6667 1 9.27885 1 6.33333C1 3.38781 3.38781 1 6.33333 1C9.27885 1 11.6667 3.38781 11.6667 6.33333Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <Form.Control
            type="text"
            className="custom-form-control"
            placeholder="Поиск по названию активности..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </Form.Group>

        {/* Traffic Slider Filter */}
        <Form.Group className="mb-3">
          <Form.Label className="filter-label">
            <span>Макс. объем трафика:</span>
            <span className="filter-badge-val">{filters.maxTraffic} Мбит/с</span>
          </Form.Label>
          <Form.Range
            min={0}
            max={150}
            step={5}
            value={filters.maxTraffic}
            onChange={handleTrafficChange}
          />
          <div className="slider-limits">
            <span>0</span>
            <span>75</span>
            <span>150 Мбит/с</span>
          </div>
        </Form.Group>

        {/* Sort Filter */}
        <Form.Group className="mb-3">
          <Form.Label className="filter-label">Сортировка:</Form.Label>
          <Form.Select
            className="custom-form-select"
            value={filters.sortBy}
            onChange={handleSortChange}
          >
            <option value="default">По умолчанию (по ID)</option>
            <option value="traffic-asc">По возрастанию трафика (⚡)</option>
            <option value="traffic-desc">По убыванию трафика (⚡)</option>
            <option value="latency-asc">По минимальной задержке (⏱)</option>
            <option value="likes-desc">По популярности (♡ лайки)</option>
          </Form.Select>
        </Form.Group>

        {/* Action Buttons */}
        <Row className="g-2">
          <Col xs={7}>
            <Button type="submit" className="btn-filter-apply w-100">
              Применить
            </Button>
          </Col>
          <Col xs={5}>
            <Button type="button" onClick={onReset} className="btn-filter-reset w-100">
              Сброс
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
