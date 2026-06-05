import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/taskService';

// GET /api/tasks
export function getTasks(req: Request, res: Response, next: NextFunction): void {
  try {
    const tasks = taskService.getAllTasks();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

// POST /api/tasks
export function createTask(req: Request, res: Response, next: NextFunction): void {
  try {
    const { title, description, dueDate } = req.body as {
      title: string;
      description?: string;
      dueDate?: string;
    };
    const task = taskService.createTask({ title, description, dueDate });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/tasks/:id
export function updateTask(req: Request, res: Response, next: NextFunction): void {
  try {
    const { id } = req.params;
    const updated = taskService.updateTask(id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/tasks/:id
export function deleteTask(req: Request, res: Response, next: NextFunction): void {
  try {
    const { id } = req.params;
    const deleted = taskService.deleteTask(id);
    if (!deleted) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
}

// PUT /api/tasks/reorder
export function reorderTasks(req: Request, res: Response, next: NextFunction): void {
  try {
    const { orderedIds } = req.body as { orderedIds: string[] };
    if (!Array.isArray(orderedIds)) {
      res.status(400).json({ error: 'orderedIds must be an array of strings' });
      return;
    }
    const tasks = taskService.reorderTasks(orderedIds);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}
