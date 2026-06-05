import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'tasks.json');

// ─── File I/O ────────────────────────────────────────────────────────────────

function readTasks(): Task[] {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  try {
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

function writeTasks(tasks: Task[]): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

// ─── Service Functions ────────────────────────────────────────────────────────

export function getAllTasks(): Task[] {
  const tasks = readTasks();
  // Sort by order field, then fallback to newest-first by createdAt
  return tasks.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function getTaskById(id: string): Task | undefined {
  const tasks = readTasks();
  return tasks.find((t) => t.id === id);
}

export function createTask(input: CreateTaskInput): Task {
  const tasks = readTasks();
  const now = new Date().toISOString();
  const newTask: Task = {
    id: uuidv4(),
    title: input.title.trim(),
    description: input.description?.trim(),
    dueDate: input.dueDate,
    completed: false,
    createdAt: now,
    order: 0, // new tasks go to the top (lowest order)
  };

  // Shift all existing tasks down by 1
  const updated = tasks.map((t) => ({ ...t, order: t.order + 1 }));
  updated.unshift(newTask);
  writeTasks(updated);
  return newTask;
}

export function updateTask(id: string, input: UpdateTaskInput): Task | null {
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const updated: Task = {
    ...tasks[index],
    ...input,
    title: input.title !== undefined ? input.title.trim() : tasks[index].title,
  };
  tasks[index] = updated;
  writeTasks(tasks);
  return updated;
}

export function deleteTask(id: string): boolean {
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;

  tasks.splice(index, 1);
  writeTasks(tasks);
  return true;
}

export function reorderTasks(orderedIds: string[]): Task[] {
  const tasks = readTasks();
  const taskMap = new Map(tasks.map((t) => [t.id, t]));

  const reordered = orderedIds
    .filter((id) => taskMap.has(id))
    .map((id, index) => ({ ...taskMap.get(id)!, order: index }));

  // Preserve any tasks not in orderedIds at the end
  const includedIds = new Set(orderedIds);
  const remainder = tasks
    .filter((t) => !includedIds.has(t.id))
    .map((t, i) => ({ ...t, order: reordered.length + i }));

  const finalTasks = [...reordered, ...remainder];
  writeTasks(finalTasks);
  return finalTasks.sort((a, b) => a.order - b.order);
}
