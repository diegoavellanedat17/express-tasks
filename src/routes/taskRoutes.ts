import { Router } from 'express';
import {
  createTask,
  updateTask,
  deleteTask,
  getTasksForUser,
} from '../controllers/taskController';
import { authMiddleware } from '../middlewares/authMiddleware';

const taskRoutes = Router();

taskRoutes.post('/tasks', authMiddleware, createTask);
taskRoutes.put('/tasks/:id', authMiddleware, updateTask);
taskRoutes.delete('/tasks/:id', authMiddleware, deleteTask);
taskRoutes.get('/tasks', authMiddleware, getTasksForUser);

export default taskRoutes;
