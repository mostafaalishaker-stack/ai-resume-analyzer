import { useState } from 'react';
import ResumeUpload from './components/ResumeUpload';
import Results from './components/Results';
import type { ResumeAnalysis } from './types';

const styles = {
  container: { minHeight: '100vh', background: '#0b1120', color: '#f1f5f9', fontFamily: 'Inter,sans-serif' },
  header: { background: '#131c31', borderBottom: '1px solid #1e293b', padding: '16px 24px' },
  headerInner: { maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as const,
  logo: { fontSize: '1.3rem', fontWeight: 800, background: 'linear-gradient(135deg,#6366f1,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } as const,
  main: { maxWidth: 1200, margin: '0 auto', padding: '40px 24px' },
  badge: { display: 'inline-block', padding: '6px 16px', borderRadius: 50, background: 'rgba(99,102,241,.1)', color: '#6366f1', fontSize: '.85rem', fontWeight: 600, marginBottom: 12 },
  title: { fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 800, marginBottom: 12 },
  desc: { color: '#94a3b8', fontSize: '1.1rem', maxWidth: 600, marginBottom: 32 },
};

export default function App() {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [fileName, setFileName] = useState('');

  const handleAnalysis = (data: ResumeAnalysis, name: string) => {
    setAnalysis(data);
    setFileName(name);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <span style={styles.logo}>AI Resume Analyzer</span>
          <a href="../" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '.9rem' }}>&larr; Back</a>
        </div>
      </header>
      <main style={styles.main}>
        <div style={{ marginBottom: 40 }}>
          <div style={styles.badge}><i className="fas fa-robot"></i> AI-Powered</div>
          <h1 style={styles.title}>Analyze Your Resume</h1>
          <p style={styles.desc}>Upload your resume (PDF) and get instant AI-powered feedback, scores, and improvement suggestions.</p>
        </div>
        {!analysis ? (
          <ResumeUpload onAnalysis={handleAnalysis} />
        ) : (
          <Results analysis={analysis} fileName={fileName} onReset={() => setAnalysis(null)} />
        )}
      </main>
    </div>
  );
}
