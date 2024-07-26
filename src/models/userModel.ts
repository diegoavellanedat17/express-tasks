import { getDBConnection } from '../utils';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

export const createUser = async (
  username: string,
  email: string,
  password: string,
) => {
  const db = await getDBConnection();
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.run(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword],
  );
  return result.lastID;
};

export const findUserByEmail = async (email: string) => {
  const db = await getDBConnection();
  const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  return user;
};
