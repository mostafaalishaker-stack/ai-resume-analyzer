import { useState, useRef, KeyboardEvent } from 'react';
import { analyzeResume } from '../api/client';
import type { ResumeAnalysis } from '../types';

interface Props {
  onAnalysis: (data: ResumeAnalysis, fileName: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const styles: Record<string, React.CSSProperties> = {
  uploadBox: { border: '2px dashed #1e293b', borderRadius: 16, padding: '60px 24px', textAlign: 'center', cursor: 'pointer', transition: 'all .3s', background: '#131c31', outline: 'none' },
  uploadBoxFocus: { border: '2px dashed #6366f1', borderRadius: 16, padding: '60px 24px', textAlign: 'center', cursor: 'pointer', transition: 'all .3s', background: '#131c31', outline: '2px solid #6366f1', outlineOffset: '2px' },
  uploadIcon: { fontSize: '3rem', color: '#6366f1', marginBottom: 16 },
  uploadText: { color: '#94a3b8', fontSize: '1rem', marginBottom: 8 },
  uploadHint: { color: '#94a3b8', fontSize: '.85rem' },
  btn: { padding: '14px 32px', borderRadius: 12, fontWeight: 600, fontSize: '.95rem', cursor: 'pointer', border: 'none', transition: '.3s' },
  error: { color: '#ef4444', marginTop: 12, fontSize: '.9rem' },
};

export default function ResumeUpload({ onAnalysis }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.match(/\.(pdf|txt|doc|docx)$/i)) { setError('Please upload a PDF, TXT, or DOCX file.'); return; }
    if (file.size > MAX_FILE_SIZE) { setError('File is too large. Maximum size is 5MB.'); return; }
    setLoading(true); setError('');
    try {
      const res = await analyzeResume(file);
      onAnalysis(res.data.analysis, res.data.fileName);
    } catch (e: any) {
      setError(e.response?.data?.error || 'Analysis failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload resume area. Press Enter or Space to select a file."
      style={{ ...styles.uploadBox, borderColor: dragOver ? '#6366f1' : '#1e293b', opacity: loading ? .6 : 1, ...(focused ? styles.uploadBoxFocus : {}) }}
      onClick={() => inputRef.current?.click()}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
    >
      <input ref={inputRef} type="file" accept=".pdf,.txt,.doc,.docx" hidden aria-label="File upload input for resume" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      <div style={styles.uploadIcon}>{loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-cloud-upload-alt"></i>}</div>
      <p style={styles.uploadText}>{loading ? 'Analyzing your resume...' : 'Drag & drop your resume here, or click to browse'}</p>
      <p style={styles.uploadHint}>Supports PDF, TXT, DOCX (max 5MB)</p>
      {error && <p style={styles.error}><i className="fas fa-exclamation-circle"></i> {error}</p>}
    </div>
  );
}
