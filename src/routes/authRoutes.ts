import { Router } from 'express';
import { register, login, getUser } from '../controllers';
import { authMiddleware } from '../middlewares/authMiddleware';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', authMiddleware, getUser);

export default authRouter;
