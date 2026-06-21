export interface ResumeAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  skillsFound: string[];
  missingSkills: string[];
  improvements: string[];
  recommendedTitles: string[];
  experienceLevel: string;
}

export interface AnalysisResponse {
  analysis: ResumeAnalysis;
  fileName: string;
}
