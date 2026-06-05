import React from 'react';
import type { FilterStatus } from '../types/task';

interface EmptyStateProps {
  filter: FilterStatus;
  hasSearch: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ filter, hasSearch }) => {
  let emoji = '✅';
  let heading = 'All clear!';
  let sub = 'Add a new task to get started.';

  if (hasSearch) {
    emoji = '🔍';
    heading = 'No results found';
    sub = 'Try a different search term.';
  } else if (filter === 'active') {
    emoji = '🎉';
    heading = 'No active tasks';
    sub = 'Everything is done — great work!';
  } else if (filter === 'completed') {
    emoji = '📋';
    heading = 'Nothing completed yet';
    sub = 'Finish a task to see it here.';
  }

  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-emoji" aria-hidden="true">{emoji}</div>
      <h3 className="empty-heading">{heading}</h3>
      <p className="empty-sub">{sub}</p>
    </div>
  );
};

export default EmptyState;
