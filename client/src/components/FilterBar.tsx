import React from 'react';
import type { FilterStatus } from '../types/task';

interface FilterBarProps {
  current: FilterStatus;
  onChange: (filter: FilterStatus) => void;
  counts: { all: number; active: number; completed: number };
}

const FILTERS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

const FilterBar: React.FC<FilterBarProps> = ({ current, onChange, counts }) => {
  return (
    <nav className="filter-bar" aria-label="Filter tasks">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          id={`filter-${value}`}
          className={`filter-btn ${current === value ? 'filter-btn--active' : ''}`}
          onClick={() => onChange(value)}
          aria-pressed={current === value}
        >
          {label}
          <span className="filter-count">
            {counts[value]}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default FilterBar;
