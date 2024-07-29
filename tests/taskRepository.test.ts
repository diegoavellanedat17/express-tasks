import {
  createTaskInDB,
  updateTaskInDB,
  deleteTaskInDB,
  getTaskFromDB,
  getTasksForUserFromDB,
} from '../src/repositories';
import { getDBConnection } from '../src/utils/db';
import { Task } from '../src/models';

jest.mock('../src/utils/db', () => ({
  getDBConnection: jest.fn(),
}));

describe('Task Service Functions', () => {
  let mockDB: any;

  beforeEach(() => {
    mockDB = {
      run: jest.fn(),
      get: jest.fn(),
      all: jest.fn(),
    };
    (getDBConnection as jest.Mock).mockResolvedValue(mockDB);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createTaskInDB', () => {
    it('should insert a task into the database and return the lastID', async () => {
      const task: Task = {
        title: 'Test Task',
        description: 'Test Description',
        due_date: '2024-01-01',
        user_id: 1,
        id: 0,
        completed: false,
      };
      mockDB.run.mockResolvedValue({ lastID: 1 });

      const result = await createTaskInDB(task);
      expect(result).toBe(1);
      expect(mockDB.run).toHaveBeenCalledWith(
        'INSERT INTO tasks (title, description, due_date, user_id) VALUES (?, ?, ?, ?)',
        [task.title, task.description, task.due_date, task.user_id],
      );
    });
  });

  describe('updateTaskInDB', () => {
    it('should update a task in the database', async () => {
      const task: Task = {
        title: 'Updated Task',
        description: 'Updated Description',
        due_date: '2024-01-01',
        user_id: 1,
        id: 1,
        completed: true,
      };

      mockDB.run.mockResolvedValue({ changes: 1 }); // Mocking the result for update

      await updateTaskInDB(task);
      expect(mockDB.run).toHaveBeenCalledWith(
        'UPDATE tasks SET title = ?, description = ?, due_date = ?, completed = ? WHERE id = ? AND user_id = ?',
        [
          task.title,
          task.description,
          task.due_date,
          task.completed,
          task.id,
          task.user_id,
        ],
      );
    });
  });

  describe('deleteTaskInDB', () => {
    it('should delete a task from the database', async () => {
      const id = 1;
      const userId = 1;

      mockDB.run.mockResolvedValue({ changes: 1 }); // Mocking the result for delete

      await deleteTaskInDB(id, userId);
      expect(mockDB.run).toHaveBeenCalledWith(
        'DELETE FROM tasks WHERE id = ? AND user_id = ?',
        [id, userId],
      );
    });
  });

  describe('getTaskFromDB', () => {
    it('should retrieve a task from the database', async () => {
      const task: Task = {
        title: 'Test Task',
        description: 'Test Description',
        due_date: '2024-01-01',
        user_id: 1,
        id: 1,
        completed: false,
      };
      mockDB.get.mockResolvedValue(task);

      const result = await getTaskFromDB(1, 1);
      expect(result).toEqual(task);
      expect(mockDB.get).toHaveBeenCalledWith(
        'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
        [1, 1],
      );
    });
  });

  describe('getTasksForUserFromDB', () => {
    it('should retrieve all tasks for a user from the database', async () => {
      const tasks: Task[] = [
        {
          title: 'Task 1',
          description: 'Description 1',
          due_date: '2024-01-01',
          user_id: 1,
          id: 1,
          completed: false,
        },
        {
          title: 'Task 2',
          description: 'Description 2',
          due_date: '2024-01-02',
          user_id: 1,
          id: 2,
          completed: true,
        },
      ];
      mockDB.all.mockResolvedValue(tasks);

      const result = await getTasksForUserFromDB(1);
      expect(result).toEqual(tasks);
      expect(mockDB.all).toHaveBeenCalledWith(
        'SELECT * FROM tasks WHERE user_id = ?',
        [1],
      );
    });
  });
});
