export type Category = 'all' | 'distributed' | 'frontend' | 'infra' | 'realtime';

export interface ProjectMetric {
  label: string;
  value: string;
  accent?: 'emerald' | 'cyan' | 'indigo';
}

export interface ProjectCodeFile {
  filename: string;
  language: string;
  code: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: 'distributed' | 'frontend' | 'infra' | 'realtime';
  categoryLabel: string;
  summary: string;
  description: string;
  architectureHighlights: string[];
  metrics: ProjectMetric[];
  techStack: string[];
  ideFilePath: string;
  codeFiles: ProjectCodeFile[];
  diagramNodes: {
    id: string;
    label: string;
    sublabel: string;
    type: 'client' | 'gateway' | 'service' | 'storage' | 'queue';
  }[];
  simulationType: 'kv-store' | 'canvas-sync' | 'tracing-pipeline' | 'cloud-deploy' | 'orderbook' | 'graphql-stitch';
  demoUrl?: string;
  githubUrl?: string;
}

export interface TechItem {
  name: string;
  category: 'Frontend & UI Engine' | 'Backend & Distributed' | 'Data & Storage' | 'Cloud & DevOps';
  icon: string;
  level: string;
  years: string;
  projectsCount: number;
  featuredIn: string[];
  description: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  summary: string;
  achievements: string[];
  technologies: string[];
}

export interface ADRItem {
  id: string;
  title: string;
  status: 'Accepted' | 'Implemented' | 'Superseded';
  date: string;
  context: string;
  decision: string;
  consequences: string[];
}

export interface TerminalEntry {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'info';
  content: string;
  timestamp: string;
}
