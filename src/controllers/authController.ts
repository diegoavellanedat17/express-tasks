import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models';
import { createUser, findUserByEmail } from '../repositories';

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userId = await createUser(username, email, password);
    res.status(201).json({ userId });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
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
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUser = (req: Request, res: Response) => {
  try {
    const user = (req as any).user as User;
    const { username, email } = user;
    res.json({ username, email });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
