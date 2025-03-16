import { Router, Request, Response, NextFunction } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

router.post('/register', (req: Request, res: Response) => {
  register(req, res);
});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  login(req, res);
});

export default router;



