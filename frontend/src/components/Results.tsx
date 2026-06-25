import type { ResumeAnalysis } from '../types';
import { EmptyState } from './EmptyState';

interface Props {
  analysis: ResumeAnalysis;
  fileName: string;
  onReset: () => void;
}

function ScoreRing({ score }: { score: number }) {
  const r = 60, circ = 2 * Math.PI * r, offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r={r} fill="none" stroke="#1e293b" strokeWidth="10"/>
        <circle cx="75" cy="75" r={r} fill="none" stroke={color} strokeWidth="10" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 75 75)" style={{ transition: 'stroke-dashoffset 1.5s ease' }}/>
        <text x="75" y="70" textAnchor="middle" fill="#f1f5f9" fontSize="2rem" fontWeight="800">{score}</text>
        <text x="75" y="92" textAnchor="middle" fill="#94a3b8" fontSize=".8rem">Score</text>
      </svg>
      <span style={{ fontSize: '.9rem', color, fontWeight: 600 }}>
        {score >= 80 ? 'Excellent!' : score >= 60 ? 'Good' : 'Needs Improvement'}
      </span>
    </div>
  );
}

function Section({ title, items, icon, color }: { title: string; items: string[]; icon: string; color: string }) {
  return (
    <div style={{ background: '#131c31', border: '1px solid #1e293b', borderRadius: 16, padding: 24 }}>
      <h3 style={{ fontSize: '1.05rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#f1f5f9' }}>
        <i className={icon} style={{ color }}></i> {title}
      </h3>
      {items.length === 0 ? (
        <p style={{ color: '#64748b', fontSize: '.85rem' }}>No items to display.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item, i) => (
            <li key={i} style={{ color: '#cbd5e1', fontSize: '.9rem', padding: '6px 0', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ color, marginTop: 2 }}>•</span> {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Results({ analysis, fileName, onReset }: Props) {
  const { score, strengths, weaknesses, skillsFound, missingSkills, improvements, recommendedTitles, experienceLevel } = analysis;

  if (!analysis.score && !analysis.strengths?.length && !analysis.weaknesses?.length) {
    return <EmptyState icon="📄" title="No analysis data" message="The analysis returned incomplete results. Try uploading a different resume." action={{ label: 'Try Again', onClick: onReset }} />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '.85rem' }}>File: {fileName}</p>
          <p style={{ color: '#818cf8', fontSize: '.85rem', fontWeight: 600 }}>Level: {experienceLevel}</p>
        </div>
        <button onClick={onReset} style={{ padding: '10px 24px', borderRadius: 12, background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: '.9rem', cursor: 'pointer', border: 'none', transition: '.3s' }}
          onFocus={e => { e.currentTarget.style.outline = '2px solid #a5b4fc'; e.currentTarget.style.outlineOffset = '2px'; }}
          onBlur={e => { e.currentTarget.style.outline = 'none'; }}>
          <i className="fas fa-upload"></i> Analyze Another
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 32, marginBottom: 32, alignItems: 'start' }}>
        <ScoreRing score={score} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignContent: 'start' }}>
          <p style={{ width: '100%', color: '#94a3b8', fontSize: '.9rem', marginBottom: 8 }}>Recommended Roles:</p>
          {recommendedTitles.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '.85rem' }}>No recommendations available.</p>
          ) : recommendedTitles.map((t, i) => (
            <span key={i} style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(99,102,241,.1)', color: '#818cf8', fontSize: '.85rem', fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <Section title="Key Strengths" items={strengths} icon="fas fa-star" color="#22c55e" />
        <Section title="Areas to Improve" items={weaknesses} icon="fas fa-exclamation-triangle" color="#eab308" />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 20 }}>
        <div style={{ flex: 1, minWidth: 280, background: '#131c31', border: '1px solid #1e293b', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, color: '#67e8f9' }}>
            <i className="fas fa-check-circle"></i> Skills Found
          </h3>
          {skillsFound.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '.85rem' }}>No skills detected.</p>
          ) : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {skillsFound.map((s, i) => <span key={i} style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(6,182,212,.1)', color: '#67e8f9', fontSize: '.8rem', fontWeight: 500 }}>{s}</span>)}
          </div>}
        </div>
        <div style={{ flex: 1, minWidth: 280, background: '#131c31', border: '1px solid #1e293b', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, color: '#c084fc' }}>
            <i className="fas fa-plus-circle"></i> Missing Skills
          </h3>
          {missingSkills.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '.85rem' }}>No missing skills identified.</p>
          ) : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {missingSkills.map((s, i) => <span key={i} style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(168,85,247,.1)', color: '#c084fc', fontSize: '.8rem', fontWeight: 500 }}>{s}</span>)}
          </div>}
        </div>
      </div>

      <Section title="Actionable Improvements" items={improvements} icon="fas fa-lightbulb" color="#eab308" />

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <a href="../" tabIndex={0} style={{ color: '#818cf8', textDecoration: 'none', fontSize: '.9rem' }}
          onFocus={e => { e.currentTarget.style.outline = '2px solid #a5b4fc'; e.currentTarget.style.outlineOffset = '2px'; }}
          onBlur={e => { e.currentTarget.style.outline = 'none'; }}><i className="fas fa-arrow-left"></i> Back to Portfolio</a>
      </div>
    </div>
  );
}
