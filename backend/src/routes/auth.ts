import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const users: { email: string; password: string }[] = [];

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already exists' });
    const hashed = await bcrypt.hash(password, 10);
    users.push({ email, password: hashed });
    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { email } });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { email } });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

export { router as authRouter };
