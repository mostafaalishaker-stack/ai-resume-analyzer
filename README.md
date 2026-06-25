# AI Resume Analyzer

An AI-powered resume analysis tool that provides instant feedback, scoring, and improvement suggestions using OpenAI GPT-4o-mini.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Backend | Node.js, Express, TypeScript |
| AI | OpenAI GPT-4o-mini |
| Auth | JWT (bcrypt + jsonwebtoken) |
| File Upload | Multer + pdf-parse |

## Features

- Upload PDF/TXT resumes (DOCX support requires additional library)
- AI-powered analysis with scoring (0-100)
- Key strengths and weaknesses identification
- Skills gap analysis for Full Stack roles
- Actionable improvement suggestions
- Recommended job titles based on experience
- Drag & drop file upload
- User authentication (register/login) - auth middleware enabled on /analyze endpoint
- Responsive design

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Add your OPENAI_API_KEY to .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
- `OPENAI_API_KEY` - Your OpenAI API key
- `JWT_SECRET` - Secret for JWT tokens
- `DATABASE_URL` - Database connection string (optional, not used in demo mode)
