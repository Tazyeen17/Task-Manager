import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  status?: number;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  console.error('[Error]', err.message);
  const status = err.status ?? 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
    status,
  });
}
