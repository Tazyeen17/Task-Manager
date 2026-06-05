import React, { useState, useEffect, useRef } from 'react';
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../types/task';

interface TaskFormProps {
  editingTask?: Task | null;
  onSubmit: (payload: CreateTaskPayload | UpdateTaskPayload) => Promise<void>;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ editingTask, onSubmit, onClose }) => {
  const [title, setTitle] = useState(editingTask?.title ?? '');
  const [description, setDescription] = useState(editingTask?.description ?? '');
  const [dueDate, setDueDate] = useState(editingTask?.dueDate ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [titleError, setTitleError] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  const isEditing = !!editingTask;

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const validate = (): boolean => {
    if (!title.trim()) {
      setTitleError('Title is required');
      titleRef.current?.focus();
      return false;
    }
    if (title.trim().length > 200) {
      setTitleError('Title must be 200 characters or fewer');
      return false;
    }
    setTitleError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
      });
      onClose();
    } catch (err) {
      console.error('Failed to save task:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true"
      aria-labelledby="form-heading"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h2 id="form-heading" className="modal-title">
            {isEditing ? 'Edit Task' : 'New Task'}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close dialog">✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="task-title" className="form-label">
              Title <span aria-hidden="true" className="required-star">*</span>
            </label>
            <input
              ref={titleRef}
              id="task-title"
              type="text"
              className={`form-input ${titleError ? 'form-input--error' : ''}`}
              value={title}
              onChange={(e) => { setTitle(e.target.value); setTitleError(''); }}
              placeholder="What needs to be done?"
              maxLength={200}
              aria-required="true"
              aria-describedby={titleError ? 'title-error' : undefined}
            />
            {titleError && (
              <span id="title-error" className="form-error" role="alert">{titleError}</span>
            )}
            <span className="char-count">{title.length}/200</span>
          </div>

          <div className="form-group">
            <label htmlFor="task-description" className="form-label">Description</label>
            <textarea
              id="task-description"
              className="form-input form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more detail… (optional)"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-due-date" className="form-label">Due Date</label>
            <input
              id="task-due-date"
              type="date"
              className="form-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}
              id={isEditing ? 'save-task-btn' : 'add-task-btn'}>
              {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
