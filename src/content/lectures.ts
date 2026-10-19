import { lecture01 } from "./lectures/01-introduction-and-indexes";
import { lecture02 } from "./lectures/02-similar-items-part-1";
import { lecture03 } from "./lectures/03-distributed-databases";
import { lecture04 } from "./lectures/04-in-database-ml";
import { lecture05 } from "./lectures/05-similar-items-part-2";
import { lecture06 } from "./lectures/06-similar-items-part-3";
import { lecture07 } from "./lectures/07-mapreduce";
import type { Lecture } from "./types";

const lectures: Lecture[] = [lecture01, lecture02, lecture03, lecture04, lecture05, lecture06, lecture07].sort((a, b) => a.meta.number - b.meta.number);

export function allLectures() {
  return lectures;
}

export function getLecture(slug: string) {
  return lectures.find((lecture) => lecture.meta.slug === slug);
}
