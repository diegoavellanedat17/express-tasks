import { Request, Response } from 'express';
import { isValidDate } from './utils/isValidDate';
import {
  createTaskInDB,
  updateTaskInDB,
  deleteTaskInDB,
  getTaskFromDB,
  getTasksForUserFromDB,
} from '../repositories/taskRepository';
import { Task } from '../models/taskModel';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, due_date } = req.body;
    const userId = (req as any).user.id;

    if (due_date && !isValidDate(due_date)) {
      return res
        .status(400)
        .json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    const task: Task = { title, description, due_date, user_id: userId };
    const taskId = await createTaskInDB(task);

    res.status(201).json({ id: taskId, ...task });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, completed } = req.body;
    const userId = (req as any).user.id;

    const task = await getTaskFromDB(Number(id), userId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (due_date && !isValidDate(due_date)) {
      return res
        .status(400)
        .json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    const updatedTask: Task = {
      id: Number(id),
      title,
      description,
      due_date,
      completed,
      user_id: userId,
    };
    await updateTaskInDB(updatedTask);

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const task = await getTaskFromDB(Number(id), userId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await deleteTaskInDB(Number(id), userId);

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTasksForUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const tasks = await getTasksForUserFromDB(userId);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
