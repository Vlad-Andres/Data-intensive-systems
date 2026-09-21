import { Gamepad2, Layers, Sparkles } from "lucide-react";
import { ContinueStudying } from "@/components/home/ContinueStudying";
import { CourseOverview } from "@/components/home/CourseOverview";
import { LectureCard } from "@/components/home/LectureCard";
import { ProgressSummary } from "@/components/home/ProgressSummary";
import { Card } from "@/components/ui/Card";
import { lectureIndex, lectureMetas } from "@/content/registry";

const PRINCIPLES = [
  {
    icon: Layers,
    title: "Intuition before formalism",
    body: "Every section opens with the picture and closes with the formula, so the notation always arrives attached to something you already believe.",
  },
  {
    icon: Gamepad2,
    title: "Playgrounds, not screenshots",
    body: "Thresholds, shingle sizes and hash functions are controls you move. The numbers recompute live, including the ones the lecture worked out by hand.",
  },
  {
    icon: Sparkles,
    title: "Nothing important removed",
    body: "Explanations stay short, but formulas, edge cases and the reasoning behind each trade-off are kept — this is a study companion, not a summary.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-10 sm:px-6 sm:py-14">
      <CourseOverview entries={lectureIndex} />

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <ContinueStudying metas={lectureMetas} />
        <ProgressSummary metas={lectureMetas} />
      </div>

      <section id="lectures" className="grid scroll-mt-24 gap-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-semibold">Lectures</h2>
          <p className="text-sm text-faint">Added as the course goes on — earlier lectures never change.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {lectureIndex.map((entry) => (
            <LectureCard
              key={entry.meta.slug}
              meta={entry.meta}
              conceptCount={entry.concepts.length}
              quizCount={entry.quiz.length}
            />
          ))}

          <Card className="grid place-content-center gap-2 border-dashed bg-transparent p-8 text-center shadow-none">
            <p className="text-sm font-medium text-muted">Lecture {lectureIndex.length + 1}</p>
            <p className="text-sm text-faint">
              Drop in the next set of slides or chapters and this slot fills itself.
            </p>
          </Card>
        </div>
      </section>

      <section className="grid gap-5">
        <h2 className="text-xl font-semibold">How this site is built</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {PRINCIPLES.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="grid content-start gap-2 p-5">
              <Icon size={18} className="text-brand" aria-hidden />
              <h3 className="text-base font-semibold text-ink">{title}</h3>
              <p className="text-sm text-muted">{body}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
