import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail } from '../src/repositories';
import { getDBConnection } from '../src/utils/db';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

jest.mock('../src/utils/db', () => ({
  getDBConnection: jest.fn(),
}));

describe('User Repository Functions', () => {
  let mockDB: any;
  const mockHash = jest.fn();

  beforeEach(() => {
    mockDB = {
      run: jest.fn(),
      get: jest.fn(),
    };
    (getDBConnection as jest.Mock).mockResolvedValue(mockDB);
    (bcrypt.hash as jest.Mock).mockImplementation(mockHash);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createUser', () => {
    it('should create a user in the database and return the lastID', async () => {
      const username = 'testuser';
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedpassword';
      const result = { lastID: 1 };

      mockHash.mockResolvedValue(hashedPassword);
      mockDB.run.mockResolvedValue(result);

      const userId = await createUser(username, email, password);
      expect(userId).toBe(1);
      expect(mockDB.run).toHaveBeenCalledWith(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
      );
      expect(mockHash).toHaveBeenCalledWith(password, 10);
    });
  });

  describe('findUserByEmail', () => {
    it('should retrieve a user from the database by email', async () => {
      const email = 'test@example.com';
      const user = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
      };

      mockDB.get.mockResolvedValue(user);

      const result = await findUserByEmail(email);
      expect(result).toEqual(user);
      expect(mockDB.get).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = ?',
        [email],
      );
    });
  });
});
