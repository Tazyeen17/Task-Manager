import axios from 'axios';
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../types/task';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchTasks(): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/api/tasks');
  return data;
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const { data } = await api.post<Task>('/api/tasks', payload);
  return data;
}

export async function updateTask(
  id: string,
  payload: UpdateTaskPayload
): Promise<Task> {
  const { data } = await api.patch<Task>(`/api/tasks/${id}`, payload);
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/api/tasks/${id}`);
}

export async function reorderTasks(orderedIds: string[]): Promise<Task[]> {
  const { data } = await api.put<Task[]>('/api/tasks/reorder', { orderedIds });
  return data;
}
