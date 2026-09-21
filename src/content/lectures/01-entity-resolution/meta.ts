import type { LectureMeta, SectionOutline } from "@/content/types";

export const lecture01Outline = [
  { id: "objectives", title: "Learning objectives", kind: "objectives" },
  { id: "big-picture", title: "One entity, a thousand names", kind: "intuition" },
  { id: "string-similarity", title: "Comparing strings", kind: "concepts" },
  { id: "sets-and-shingling", title: "From documents to sets", kind: "concepts" },
  { id: "minhashing", title: "Minhashing", kind: "playground" },
  { id: "lsh", title: "Locality-sensitive hashing", kind: "playground" },
  { id: "pipeline", title: "The end-to-end pipeline", kind: "visual" },
  { id: "records", title: "Scoring, clustering, merging", kind: "examples" },
  { id: "distances", title: "Distance measures and LSH families", kind: "concepts" },
  { id: "high-similarity", title: "When similarity is very high", kind: "concepts" },
  { id: "mistakes", title: "Common mistakes", kind: "mistakes" },
  { id: "quiz", title: "Check your understanding", kind: "quiz" },
  { id: "summary", title: "Cheat sheet", kind: "summary" },
] as const satisfies readonly SectionOutline[];

export type Lecture01SectionId = (typeof lecture01Outline)[number]["id"];

export const lecture01Meta: LectureMeta = {
  slug: "entity-resolution-and-matching",
  number: 1,
  title: "Entity Resolution & Finding Similar Items",
  subtitle: "Shingling, minhashing and locality-sensitive hashing",
  summary:
    "The same real-world entity turns up under countless descriptions. This lecture builds the standard pipeline that finds those duplicates without ever comparing all pairs: turn records into sets, compress the sets into minhash signatures, and use locality-sensitive hashing to surface only the candidate pairs worth scoring.",
  topics: [
    "Entity resolution",
    "Edit and Jaro similarity",
    "Shingling",
    "Jaccard similarity",
    "Minhashing",
    "Locality-sensitive hashing",
    "Banding and the S-curve",
    "Distance measures",
    "Prefix indexing",
  ],
  difficulty: "core",
  estimatedMinutes: 75,
  sources: [
    { label: "Lecture 3 — Entity Resolution", kind: "slides", detail: "Yannis Velegrakis" },
    { label: "Lecture 4 — Matching", kind: "slides", detail: "Yannis Velegrakis" },
    {
      label: "Mining of Massive Datasets, Chapter 3",
      kind: "chapter",
      detail: "Leskovec, Rajaraman & Ullman — Finding Similar Items",
    },
  ],
  objectives: [
    "Explain why entity resolution is unavoidable and why naive pairwise comparison is not an option.",
    "Choose an appropriate atomic similarity for a field: edit distance, gap distance or Jaro.",
    "Represent documents and records as sets of k-shingles and justify the choice of k.",
    "State and use the minhash property that collision probability equals Jaccard similarity.",
    "Tune the banding parameters b and r to place the LSH threshold where you want it.",
    "Trace a full pipeline from raw records to a merged clean relation, and validate the matches.",
  ],
  takeaways: [
    "Entity resolution is three steps: identify the same object, decide how to merge, update the collection.",
    "Shingling turns textual similarity into Jaccard similarity of sets; k must be large enough that a given shingle is unlikely in a given document.",
    "Minhashing preserves that similarity in expectation: P[h(C₁) = h(C₂)] = SIM(C₁, C₂).",
    "Banding gives the S-curve 1 − (1 − sʳ)ᵇ, with the threshold near (1/b)^(1/r).",
    "LSH trades exactness for speed — false negatives are real, and prefix indexing is the exact alternative when similarity must be very high.",
    "Record matching does not fit the plain set model: block first, score with field-aware rules, then cluster and merge.",
  ],
  outline: lecture01Outline,
};
