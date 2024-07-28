import { getDBConnection } from '../utils/db';
import { Task } from '../models/taskModel';

export const createTaskInDB = async (
  task: Task,
): Promise<number | undefined> => {
  const db = await getDBConnection();
  const result = await db.run(
    `INSERT INTO tasks (title, description, due_date, user_id) VALUES (?, ?, ?, ?)`,
    [task.title, task.description, task.due_date, task.user_id],
  );
  return result.lastID;
};

export const updateTaskInDB = async (task: Task): Promise<void> => {
  const db = await getDBConnection();
  await db.run(
    `UPDATE tasks SET title = ?, description = ?, due_date = ?, completed = ? WHERE id = ? AND user_id = ?`,
    [
      task.title,
      task.description,
      task.due_date,
      task.completed,
      task.id,
      task.user_id,
    ],
  );
};

export const deleteTaskInDB = async (
  id: number,
  userId: number,
): Promise<void> => {
  const db = await getDBConnection();
  await db.run(`DELETE FROM tasks WHERE id = ? AND user_id = ?`, [id, userId]);
};

export const getTaskFromDB = async (
  id: number,
  userId: number,
): Promise<Task | undefined> => {
  const db = await getDBConnection();
  return await db.get(`SELECT * FROM tasks WHERE id = ? AND user_id = ?`, [
    id,
    userId,
  ]);
};

export const getTasksForUserFromDB = async (
  userId: number,
): Promise<Task[]> => {
  const db = await getDBConnection();
  return await db.all(`SELECT * FROM tasks WHERE user_id = ?`, [userId]);
};
