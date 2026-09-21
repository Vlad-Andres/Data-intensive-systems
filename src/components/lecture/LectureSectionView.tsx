import type { Lecture, LectureSection, SectionKind } from "@/content/types";
import { BlockRenderer } from "@/components/content/BlockRenderer";
import { QuizCard } from "@/components/content/QuizCard";
import { SectionCompleteToggle } from "@/components/lecture/SectionCompleteToggle";

const KIND_LABEL: Record<SectionKind, string> = {
  objectives: "Objectives",
  intuition: "Big picture",
  concepts: "Core concepts",
  visual: "Visual explanation",
  playground: "Interactive playground",
  examples: "Worked examples",
  mistakes: "Common mistakes",
  quiz: "Check understanding",
  summary: "Summary",
};

interface LectureSectionViewProps {
  lecture: Lecture;
  section: LectureSection;
}

export function LectureSectionView({ lecture, section }: LectureSectionViewProps) {
  return (
    <section id={section.id} className="grid scroll-mt-24 gap-6">
      <header className="grid gap-1">
        <p className="text-xs font-semibold tracking-wide text-brand uppercase">
          {KIND_LABEL[section.kind]}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
      </header>

      {section.blocks.map((block, index) => (
        <BlockRenderer key={index} block={block} concepts={lecture.concepts} />
      ))}

      {section.kind === "quiz" ? (
        <QuizCard
          lectureSlug={lecture.meta.slug}
          sectionId={section.id}
          questions={lecture.quiz}
        />
      ) : null}

      <div className="flex justify-end border-t border-line pt-4">
        <SectionCompleteToggle lectureSlug={lecture.meta.slug} sectionId={section.id} />
      </div>
    </section>
  );
}
