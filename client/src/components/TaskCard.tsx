import React, { useState } from 'react';
import type { Task } from '../types/task';
import ConfirmDialog from './ConfirmDialog';

interface TaskCardProps {
  task: Task;
  overdue: boolean;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00'); // prevent timezone offset
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  overdue,
  onToggle,
  onEdit,
  onDelete,
  dragHandleProps,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDeleteClick = () => setConfirmOpen(true);
  const handleConfirm = () => { setConfirmOpen(false); onDelete(task.id); };
  const handleCancel = () => setConfirmOpen(false);

  return (
    <>
      <div
        className={`task-card ${task.completed ? 'task-card--completed' : ''} ${overdue ? 'task-card--overdue' : ''}`}
        data-testid="task-card"
      >
        {/* Drag Handle */}
        <button
          className="drag-handle"
          aria-label="Drag to reorder"
          title="Drag to reorder"
          {...dragHandleProps}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
            <circle cx="7" cy="5" r="1.5" />
            <circle cx="7" cy="10" r="1.5" />
            <circle cx="7" cy="15" r="1.5" />
            <circle cx="13" cy="5" r="1.5" />
            <circle cx="13" cy="10" r="1.5" />
            <circle cx="13" cy="15" r="1.5" />
          </svg>
        </button>

        {/* Checkbox */}
        <button
          className={`task-check ${task.completed ? 'task-check--done' : ''}`}
          onClick={() => onToggle(task.id)}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          aria-pressed={task.completed}
          id={`toggle-${task.id}`}
        >
          {task.completed && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
              width="14" height="14" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="task-content">
          <p className={`task-title ${task.completed ? 'task-title--done' : ''}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          <div className="task-meta">
            {task.dueDate && (
              <span className={`task-due ${overdue ? 'task-due--overdue' : ''}`}>
                {overdue && <span aria-label="Overdue" className="overdue-dot" />}
                📅 {formatDate(task.dueDate)}
                {overdue && ' · Overdue'}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="task-actions">
          <button
            className="task-action-btn task-action-btn--edit"
            onClick={() => onEdit(task)}
            aria-label={`Edit "${task.title}"`}
            title="Edit"
            id={`edit-${task.id}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              width="15" height="15" aria-hidden="true">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className="task-action-btn task-action-btn--delete"
            onClick={handleDeleteClick}
            aria-label={`Delete "${task.title}"`}
            title="Delete"
            id={`delete-${task.id}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              width="15" height="15" aria-hidden="true">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
        </div>
      </div>

      {confirmOpen && (
        <ConfirmDialog
          message={`"${task.title}" will be permanently deleted.`}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default TaskCard;
