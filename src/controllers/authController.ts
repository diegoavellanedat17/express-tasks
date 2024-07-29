import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models';
import { createUser, findUserByEmail } from '../repositories';

const logError = (message: string, error: any) => {
  console.error(`${message}:`, error);
};

const validateRegisterInput = (req: Request) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return {
      valid: false,
      message: 'Username, email, and password are required',
    };
  }
  return { valid: true, message: '' };
};

export const register = async (req: Request, res: Response) => {
  console.log('Register endpoint called with body:', req.body);
  const { username, email, password } = req.body;

  const validation = validateRegisterInput(req);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  try {
    const userExists = await findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userId = await createUser(username, email, password);
    res.status(201).json({ userId });
  } catch (error) {
    logError('Error during registration', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  console.log('Login endpoint called with body:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user: User = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userEmail: user.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h',
      },
    );

    res.json({ token });
  } catch (error) {
    logError('Error during login', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUser = (req: Request, res: Response) => {
  console.log('GetUser endpoint called');
  try {
    const user = (req as any).user as User;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { username, email } = user;
    res.json({ username, email });
  } catch (error) {
    logError('Error during getUser', error);
    res.status(500).json({ message: 'Server error' });
  }
};
