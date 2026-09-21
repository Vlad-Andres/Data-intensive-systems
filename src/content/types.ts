import type { ComponentType } from "react";

export type Difficulty = "intro" | "core" | "advanced";

export type SectionKind =
  | "objectives"
  | "intuition"
  | "concepts"
  | "visual"
  | "playground"
  | "examples"
  | "mistakes"
  | "quiz"
  | "summary";

export interface SectionOutline {
  id: string;
  title: string;
  kind: SectionKind;
}

export interface LectureSource {
  label: string;
  kind: "slides" | "chapter" | "notes";
  detail?: string;
}

export interface LectureMeta {
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  summary: string;
  topics: string[];
  difficulty: Difficulty;
  estimatedMinutes: number;
  sources: LectureSource[];
  objectives: string[];
  takeaways: string[];
  outline: readonly SectionOutline[];
}

export interface Concept {
  id: string;
  term: string;
  short: string;
  detail?: string;
  tags?: string[];
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  answerId: string;
  explanation: string;
}

export type InfoVariant = "note" | "insight" | "warning" | "pitfall";

export type Block =
  | { kind: "prose"; md: string }
  | { kind: "info"; variant: InfoVariant; title: string; md: string }
  | { kind: "concepts"; ids: string[] }
  | { kind: "formula"; tex: string; caption?: string }
  | { kind: "code"; lang: string; code: string; caption?: string }
  | { kind: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { kind: "steps"; title: string; intro?: string; steps: WorkedStep[] }
  | { kind: "timeline"; items: TimelineItem[] }
  | { kind: "interactive"; title: string; description?: string; component: ComponentType }
  | { kind: "list"; variant: "objectives" | "takeaways"; items: string[] };

export interface WorkedStep {
  title: string;
  md: string;
}

export interface TimelineItem {
  label: string;
  title: string;
  md: string;
}

export interface LectureSection extends SectionOutline {
  blocks: Block[];
}

export interface Lecture {
  meta: LectureMeta;
  concepts: Concept[];
  quiz: QuizQuestion[];
  sections: LectureSection[];
}

export type SectionBlocks<Outline extends readonly SectionOutline[]> = Record<
  Outline[number]["id"],
  Block[]
>;
