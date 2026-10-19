import { lecture01 } from "./lectures/01-entity-resolution";
import { lecture03 } from "./lectures/03-distributed-databases";
import type { Lecture } from "./types";

const lectures: Lecture[] = [lecture01, lecture03].sort((a, b) => a.meta.number - b.meta.number);

export function allLectures() {
  return lectures;
}

export function getLecture(slug: string) {
  return lectures.find((lecture) => lecture.meta.slug === slug);
}
