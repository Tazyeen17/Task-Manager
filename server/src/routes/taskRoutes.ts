import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} from '../controllers/taskController';
import { validateCreateTask, validateUpdateTask } from '../middleware/validateTask';

const router = Router();

// PUT /reorder must come before /:id routes to avoid "reorder" being treated as an id
router.put('/reorder', reorderTasks);

router.get('/', getTasks);
router.post('/', validateCreateTask, createTask);
router.patch('/:id', validateUpdateTask, updateTask);
router.delete('/:id', deleteTask);

export default router;
