import { lecture01Concepts } from "./lectures/01-introduction-and-indexes/concepts";
import { lecture01Meta } from "./lectures/01-introduction-and-indexes/meta";
import { lecture01Quiz } from "./lectures/01-introduction-and-indexes/quiz";
import { lecture02Concepts } from "./lectures/02-similar-items-part-1/concepts";
import { lecture02Meta } from "./lectures/02-similar-items-part-1/meta";
import { lecture02Quiz } from "./lectures/02-similar-items-part-1/quiz";
import { lecture03Concepts } from "./lectures/03-distributed-databases/concepts";
import { sheet01 } from "./lectures/03-distributed-databases/exercises";
import { lecture03Meta } from "./lectures/03-distributed-databases/meta";
import { lecture03Quiz } from "./lectures/03-distributed-databases/quiz";
import { lecture04Concepts } from "./lectures/04-in-database-ml/concepts";
import { lecture04Meta } from "./lectures/04-in-database-ml/meta";
import { lecture04Quiz } from "./lectures/04-in-database-ml/quiz";
import { lecture05Concepts } from "./lectures/05-similar-items-part-2/concepts";
import { lecture05Meta } from "./lectures/05-similar-items-part-2/meta";
import { lecture05Quiz } from "./lectures/05-similar-items-part-2/quiz";
import { lecture06Concepts } from "./lectures/06-similar-items-part-3/concepts";
import { lecture06Meta } from "./lectures/06-similar-items-part-3/meta";
import { lecture06Quiz } from "./lectures/06-similar-items-part-3/quiz";
import { lecture07Concepts } from "./lectures/07-mapreduce/concepts";
import { lecture07Meta } from "./lectures/07-mapreduce/meta";
import { lecture07Quiz } from "./lectures/07-mapreduce/quiz";
import { lecture08Concepts } from "./lectures/08-apache-spark/concepts";
import { lecture08Meta } from "./lectures/08-apache-spark/meta";
import { lecture08Quiz } from "./lectures/08-apache-spark/quiz";
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
  { meta: lecture02Meta, concepts: lecture02Concepts, quiz: lecture02Quiz, exercises: [] },
  { meta: lecture03Meta, concepts: lecture03Concepts, quiz: lecture03Quiz, exercises: [sheet01] },
  { meta: lecture04Meta, concepts: lecture04Concepts, quiz: lecture04Quiz, exercises: [] },
  { meta: lecture05Meta, concepts: lecture05Concepts, quiz: lecture05Quiz, exercises: [] },
  { meta: lecture06Meta, concepts: lecture06Concepts, quiz: lecture06Quiz, exercises: [] },
  { meta: lecture07Meta, concepts: lecture07Concepts, quiz: lecture07Quiz, exercises: [] },
  { meta: lecture08Meta, concepts: lecture08Concepts, quiz: lecture08Quiz, exercises: [] },
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
