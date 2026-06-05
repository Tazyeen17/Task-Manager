import { Request, Response, NextFunction } from 'express';

export function validateCreateTask(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { title } = req.body as { title?: unknown };

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    return;
  }

  if (title.trim().length > 200) {
    res.status(400).json({ error: 'Title must be 200 characters or fewer' });
    return;
  }

  next();
}

export function validateUpdateTask(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { title } = req.body as { title?: unknown };

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({ error: 'Title must be a non-empty string' });
      return;
    }
    if (title.trim().length > 200) {
      res.status(400).json({ error: 'Title must be 200 characters or fewer' });
      return;
    }
  }

  next();
}
