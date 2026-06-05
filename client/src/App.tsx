import React, { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import TaskStats from './components/TaskStats';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import TaskForm from './components/TaskForm';
import DraggableTaskList from './components/DraggableTaskList';
import EmptyState from './components/EmptyState';
import type { Task } from './types/task';

const App: React.FC = () => {
  const {
    tasks,
    filteredTasks,
    filter,
    setFilter,
    search,
    setSearch,
    loading,
    error,
    stats,
    addTask,
    editTask,
    toggleTask,
    removeTask,
    reorder,
    isOverdue,
  } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddClick = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleFormSubmit = async (payload: Parameters<typeof addTask>[0]) => {
    if (editingTask) {
      await editTask(editingTask.id, payload);
    } else {
      await addTask(payload);
    }
  };

  const filterCounts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  return (
    <>
      {/* Background decorative blobs */}
      <div className="bg-blob bg-blob-1" aria-hidden="true" />
      <div className="bg-blob bg-blob-2" aria-hidden="true" />

      <div className="app-wrapper">
        {/* Header */}
        <header className="app-header">
          <div className="header-brand">
            <div className="header-logo" aria-hidden="true">✓</div>
            <div>
              <h1 className="header-title">TaskFlow</h1>
              <p className="header-subtitle">Your personal productivity hub</p>
            </div>
          </div>
          <button
            id="add-task-fab"
            className="btn btn-primary btn-add"
            onClick={handleAddClick}
            aria-label="Add new task"
          >
            <span aria-hidden="true">+</span>
            New Task
          </button>
        </header>

        {/* Stats */}
        <TaskStats
          active={stats.active}
          completed={stats.completed}
          overdue={stats.overdue}
          total={stats.total}
        />

        {/* Controls */}
        <div className="controls-row">
          <SearchBar value={search} onChange={setSearch} />
          <FilterBar current={filter} onChange={setFilter} counts={filterCounts} />
        </div>

        {/* Main Content */}
        <main className="task-container" aria-label="Tasks">
          {loading && (
            <div className="loading-state" role="status" aria-live="polite">
              <div className="spinner" aria-hidden="true" />
              <span>Loading tasks…</span>
            </div>
          )}

          {!loading && error && (
            <div className="error-state" role="alert">
              <span className="error-icon" aria-hidden="true">⚠️</span>
              <p>{error}</p>
              <button className="btn btn-ghost" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          )}

          {!loading && !error && filteredTasks.length === 0 && (
            <EmptyState filter={filter} hasSearch={!!search.trim()} />
          )}

          {!loading && !error && filteredTasks.length > 0 && (
            <DraggableTaskList
              tasks={filteredTasks}
              isOverdue={isOverdue}
              onToggle={toggleTask}
              onEdit={handleEditClick}
              onDelete={removeTask}
              onReorder={reorder}
            />
          )}
        </main>

        <footer className="app-footer">
          <p>TaskFlow · Built for Studio Graphene Assessment</p>
        </footer>
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          editingTask={editingTask}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </>
  );
};

export default App;
