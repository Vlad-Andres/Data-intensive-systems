import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { lectureIndex, lectureMetas } from "@/content/registry";
import { buildSearchRecords } from "@/lib/search";
import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/theme";

export const metadata: Metadata = {
  title: {
    default: "DIS Study Playground",
    template: "%s · DIS Study Playground",
  },
  description:
    "An interactive companion for the Data Intensive Systems course: visual explanations, playgrounds and quizzes, one lecture at a time.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const records = buildSearchRecords(lectureIndex);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-brand-ink"
        >
          Skip to content
        </a>
        <SiteHeader metas={lectureMetas} records={records} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
