import React from 'react';

interface TaskStatsProps {
  active: number;
  completed: number;
  overdue: number;
  total: number;
}

const TaskStats: React.FC<TaskStatsProps> = ({ active, completed, overdue, total }) => {
  return (
    <div className="stats-bar" role="status" aria-label="Task statistics">
      <div className="stat-item">
        <span className="stat-value">{total}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-value stat-active">{active}</span>
        <span className="stat-label">Active</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-value stat-completed">{completed}</span>
        <span className="stat-label">Completed</span>
      </div>
      {overdue > 0 && (
        <>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value stat-overdue">{overdue}</span>
            <span className="stat-label">Overdue</span>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskStats;
