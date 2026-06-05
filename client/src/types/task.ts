export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // "YYYY-MM-DD"
  completed: boolean;
  createdAt: string;
  order: number;
}

export type FilterStatus = 'all' | 'active' | 'completed';

export type CreateTaskPayload = {
  title: string;
  description?: string;
  dueDate?: string;
};

export type UpdateTaskPayload = Partial<
  Pick<Task, 'title' | 'description' | 'dueDate' | 'completed'>
>;
