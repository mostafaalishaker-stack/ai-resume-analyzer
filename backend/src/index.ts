import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { resumeRouter } from './routes/resume.js';
import { authRouter } from './routes/auth.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/resume', resumeRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
