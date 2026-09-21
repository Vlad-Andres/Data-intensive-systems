import { lecture01Concepts } from "./lectures/01-entity-resolution/concepts";
import { lecture01Meta } from "./lectures/01-entity-resolution/meta";
import { lecture01Quiz } from "./lectures/01-entity-resolution/quiz";
import type { Concept, LectureMeta, QuizQuestion } from "./types";

export interface LectureIndexEntry {
  meta: LectureMeta;
  concepts: Concept[];
  quiz: QuizQuestion[];
}

export const lectureIndex: LectureIndexEntry[] = [
  { meta: lecture01Meta, concepts: lecture01Concepts, quiz: lecture01Quiz },
].sort((a, b) => a.meta.number - b.meta.number);

export const lectureMetas: LectureMeta[] = lectureIndex.map((entry) => entry.meta);

export function findLectureEntry(slug: string) {
  return lectureIndex.find((entry) => entry.meta.slug === slug);
}

export function neighbourLectures(slug: string) {
  const position = lectureIndex.findIndex((entry) => entry.meta.slug === slug);
  return {
    previous: position > 0 ? lectureIndex[position - 1].meta : null,
    next: position >= 0 && position < lectureIndex.length - 1 ? lectureIndex[position + 1].meta : null,
  };
}
