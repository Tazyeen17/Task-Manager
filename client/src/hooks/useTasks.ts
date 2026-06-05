import { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from '../api/tasks';
import type { Task, FilterStatus, CreateTaskPayload, UpdateTaskPayload } from '../types/task';

function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.dueDate) < today;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Load ─────────────────────────────────────────────────────────────────
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.fetchTasks();
      setTasks(data);
    } catch {
      setError('Failed to load tasks. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // ─── Actions ──────────────────────────────────────────────────────────────
  const addTask = useCallback(async (payload: CreateTaskPayload) => {
    const task = await api.createTask(payload);
    setTasks((prev) => [task, ...prev]);
  }, []);

  const editTask = useCallback(async (id: string, payload: UpdateTaskPayload) => {
    const updated = await api.updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  const toggleTask = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      await editTask(id, { completed: !task.completed });
    },
    [tasks, editTask]
  );

  const removeTask = useCallback(async (id: string) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const reorder = useCallback(async (orderedIds: string[]) => {
    // Optimistic update
    setTasks((prev) => {
      const map = new Map(prev.map((t) => [t.id, t]));
      return orderedIds
        .filter((id) => map.has(id))
        .map((id, index) => ({ ...map.get(id)!, order: index }));
    });
    try {
      const updated = await api.reorderTasks(orderedIds);
      setTasks(updated);
    } catch {
      // revert on failure
      loadTasks();
    }
  }, [loadTasks]);

  // ─── Derived State ────────────────────────────────────────────────────────
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
      })
      .filter((t) => {
        if (!search.trim()) return true;
        return t.title.toLowerCase().includes(search.toLowerCase());
      });
  }, [tasks, filter, search]);

  const stats = useMemo(() => {
    const active = tasks.filter((t) => !t.completed).length;
    const completed = tasks.filter((t) => t.completed).length;
    const overdue = tasks.filter(isOverdue).length;
    return { active, completed, overdue, total: tasks.length };
  }, [tasks]);

  return {
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
  };
}
