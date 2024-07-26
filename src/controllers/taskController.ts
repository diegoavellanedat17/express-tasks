import { Request, Response } from 'express';
import { getDBConnection } from '../utils/db';
import { Task } from '../models/taskModel';
import { isValidDate } from './utils';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, due_date } = req.body;
    const userId = (req as any).user.id;

    if (due_date && !isValidDate(due_date)) {
      return res
        .status(400)
        .json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    const db = await getDBConnection();
    const result = await db.run(
      `INSERT INTO tasks (title, description, due_date, user_id) VALUES (?, ?, ?, ?)`,
      [title, description, due_date, userId],
    );

    res.status(201).json({
      id: result.lastID,
      title,
      description,
      due_date,
      user_id: userId,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, completed } = req.body;
    const userId = (req as any).user.id;

    const db = await getDBConnection();
    const task = await db.get(
      `SELECT * FROM tasks WHERE id = ? AND user_id = ?`,
      [id, userId],
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await db.run(
      `UPDATE tasks SET title = ?, description = ?, due_date = ?, completed = ? WHERE id = ? AND user_id = ?`,
      [title, description, due_date, completed, id, userId],
    );

    res
      .status(200)
      .json({ id, title, description, due_date, completed, user_id: userId });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const db = await getDBConnection();
    const task = await db.get(
      `SELECT * FROM tasks WHERE id = ? AND user_id = ?`,
      [id, userId],
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await db.run(`DELETE FROM tasks WHERE id = ? AND user_id = ?`, [
      id,
      userId,
    ]);

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTasksForUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const db = await getDBConnection();
    const tasks = await db.all(`SELECT * FROM tasks WHERE user_id = ?`, [
      userId,
    ]);

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
