import { lecture01Concepts } from "./lectures/01-entity-resolution/concepts";
import { lecture01Meta } from "./lectures/01-entity-resolution/meta";
import { lecture01Quiz } from "./lectures/01-entity-resolution/quiz";
import { lecture03Concepts } from "./lectures/03-distributed-databases/concepts";
import { sheet01 } from "./lectures/03-distributed-databases/exercises";
import { lecture03Meta } from "./lectures/03-distributed-databases/meta";
import { lecture03Quiz } from "./lectures/03-distributed-databases/quiz";
import type { Concept, ExerciseSheet, LectureMeta, QuizQuestion } from "./types";

export interface LectureIndexEntry {
  meta: LectureMeta;
  concepts: Concept[];
  quiz: QuizQuestion[];
  exercises: ExerciseSheet[];
}

export function countExercises(entry: LectureIndexEntry) {
  return entry.exercises.reduce((sum, sheet) => sum + sheet.exercises.length, 0);
}

export const lectureIndex: LectureIndexEntry[] = [
  { meta: lecture01Meta, concepts: lecture01Concepts, quiz: lecture01Quiz, exercises: [] },
  { meta: lecture03Meta, concepts: lecture03Concepts, quiz: lecture03Quiz, exercises: [sheet01] },
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
