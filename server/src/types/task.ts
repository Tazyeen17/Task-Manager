export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO date string e.g. "2025-12-31"
  completed: boolean;
  createdAt: string; // ISO datetime string
  order: number; // used for drag-and-drop reordering
}

export type CreateTaskInput = Pick<Task, 'title'> &
  Partial<Pick<Task, 'description' | 'dueDate'>>;

export type UpdateTaskInput = Partial<
  Pick<Task, 'title' | 'description' | 'dueDate' | 'completed' | 'order'>
>;
