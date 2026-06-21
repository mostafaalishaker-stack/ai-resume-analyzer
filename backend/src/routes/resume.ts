import { Router, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const router = Router();
const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/analyze', upload.single('resume'), async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    let text = '';
    if (ext === '.pdf') {
      const pdfData = await import('pdf-parse');
      const dataBuffer = fs.readFileSync(filePath);
      const pdf = await pdfData.default(dataBuffer);
      text = pdf.text;
    } else if (ext === '.txt' || ext === '.md') {
      text = fs.readFileSync(filePath, 'utf-8');
    } else if (['.doc', '.docx'].includes(ext)) {
      text = 'DOCX parsing requires additional library. Please upload PDF.';
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Unsupported format. Upload PDF, TXT, or DOCX.' });
    }

    fs.unlinkSync(filePath);

    if (!text || text.trim().length < 50) return res.status(400).json({ error: 'Could not extract enough text from file.' });

    const prompt = `You are a senior HR tech recruiter. Analyze this resume and provide:
1. Overall Score (0-100)
2. Key Strengths (3-5 bullet points)
3. Weaknesses / Gaps (2-3 bullet points)
4. Skills Found (as a list)
5. Missing Skills for a Full Stack Developer role (as a list)
6. Suggested Improvements (3-5 actionable tips)
7. Recommended Job Titles (3-5 titles)
8. Experience Level (Junior/Mid/Senior/Lead)

Resume content:
${text.slice(0, 8000)}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: 'You are an expert resume analyst. Return valid JSON only.' }, { role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');
    res.json({ analysis, fileName: req.file.originalname });
  } catch (error) {
    console.error(error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Analysis failed. Check your OpenAI API key.' });
  }
});

export { router as resumeRouter };
