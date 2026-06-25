import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { resumeRouter } from './routes/resume.js';
import { authRouter } from './routes/auth.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? ['https://mostafaali.dev'] : '*',
}));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/resume', resumeRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
