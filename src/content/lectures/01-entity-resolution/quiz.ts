import type { QuizQuestion } from "@/content/types";

export const lecture01Quiz: QuizQuestion[] = [
  {
    id: "q-quadratic",
    prompt:
      "You must deduplicate one million records. Why is scoring every pair with a good similarity function not an option?",
    options: [
      { id: "a", text: "The similarity function itself is too inaccurate at that scale." },
      { id: "b", text: "There are about 5 × 10¹¹ pairs, which takes days even at a million comparisons per second." },
      { id: "c", text: "One million records cannot fit in main memory." },
      { id: "d", text: "Jaccard similarity is undefined for more than 1000 sets." },
    ],
    answerId: "b",
    explanation:
      "$N(N-1)/2 \\approx 5 \\times 10^{11}$ pairs. At $10^6$ comparisons per second and $10^5$ seconds per day that is about five days — and ten million records would take more than a year. The signatures themselves fit in memory comfortably; the **pairs** are the problem.",
  },
  {
    id: "q-shingles",
    prompt: "What does representing a document by its k-shingles give you that a set of important words does not?",
    options: [
      { id: "a", text: "It makes the representation smaller than the document." },
      { id: "b", text: "It removes the need for a distance measure." },
      { id: "c", text: "It keeps local word order, so reordering paragraphs changes only the shingles crossing the boundaries." },
      { id: "d", text: "It guarantees that no two documents share any shingle." },
    ],
    answerId: "c",
    explanation:
      "Shingles capture short sequences, so order matters locally. Changing one word only affects the shingles within distance $k$ of it, and reordering paragraphs only affects the $2k$ shingles that cross the boundaries. Note that shingle sets are **larger** than the document, which is exactly why minhashing follows.",
  },
  {
    id: "q-k-size",
    prompt: "What goes wrong if you pick the shingle size k too small — say k = 1 on web pages?",
    options: [
      { id: "a", text: "Almost every document contains almost every shingle, so unrelated documents look highly similar." },
      { id: "b", text: "The shingle sets become too large to hash." },
      { id: "c", text: "Jaccard similarity becomes negative." },
      { id: "d", text: "Minhashing can no longer be applied." },
    ],
    answerId: "a",
    explanation:
      "k must be large enough that any given shingle is unlikely to appear in any given document. With $k=1$ nearly every page contains nearly every common character, so Jaccard similarity is high even when the pages share no phrase. Rules of thumb: $k=5$ for emails, $k=9$ for long articles.",
  },
  {
    id: "q-minhash",
    prompt: "What is the defining property of minhashing?",
    options: [
      { id: "a", text: "It compresses any set to exactly four bytes." },
      { id: "b", text: "The probability that two columns have the same minhash value equals their Jaccard similarity." },
      { id: "c", text: "It sorts the rows so that similar columns become adjacent." },
      { id: "d", text: "It removes every type-d row from the matrix." },
    ],
    answerId: "b",
    explanation:
      "Looking down the permuted columns until the first 1 appears, the two minhashes agree exactly when that row is of type a (1,1) and disagree on types b and c. So $P[h(C_1)=h(C_2)] = a/(a+b+c) = SIM(C_1,C_2)$ — the same expression as Jaccard similarity.",
  },
  {
    id: "q-banding",
    prompt: "Under the banding technique, when do two columns become a candidate pair?",
    options: [
      { id: "a", text: "When they agree in at least one row of every band." },
      { id: "b", text: "When their full signatures are identical." },
      { id: "c", text: "When they agree in all r rows of at least one band." },
      { id: "d", text: "When they land in the same bucket of the same band array more than b times." },
    ],
    answerId: "c",
    explanation:
      "Each band hashes the $r$-row slice of every column into its own bucket array, and identical slices collide. Agreeing in all $r$ rows of **any single** band is enough; the more similar two columns are, the likelier that is to happen somewhere.",
  },
  {
    id: "q-threshold",
    prompt: "You use signatures of length 64 split into b = 16 bands of r = 4 rows. Roughly where does the S-curve cross one half?",
    options: [
      { id: "a", text: "s ≈ 0.25" },
      { id: "b", text: "s ≈ 0.50" },
      { id: "c", text: "s ≈ 0.75" },
      { id: "d", text: "s ≈ 0.94" },
    ],
    answerId: "b",
    explanation:
      "The threshold is approximately $(1/b)^{1/r}$. Here that is the fourth root of $1/16$, which is exactly $1/2$. Pairs above 0.5 are very likely to be candidates, pairs below are unlikely.",
  },
  {
    id: "q-tuning",
    prompt: "Keeping the signature length n = b · r fixed, you increase r and decrease b. What happens?",
    options: [
      { id: "a", text: "The threshold rises: fewer false positives, but more similar pairs are missed." },
      { id: "b", text: "The threshold falls: more candidate pairs and more false positives." },
      { id: "c", text: "Nothing changes, because n is unchanged." },
      { id: "d", text: "The curve stops being an S-curve." },
    ],
    answerId: "a",
    explanation:
      "The threshold $(1/b)^{1/r}$ moves up as $r$ grows and $b$ shrinks — agreeing on more rows in fewer chances is harder. Choose a threshold **below** your target similarity if missing pairs is expensive, and above it if you care most about limiting the work of scoring candidates.",
  },
  {
    id: "q-exact",
    prompt: "Which technique finds every pair above the similarity bound, with no false negatives at all?",
    options: [
      { id: "a", text: "Minhashing with 400 hash functions." },
      { id: "b", text: "Banding with a threshold well below the target." },
      { id: "c", text: "Prefix indexing combined with length-based filtering." },
      { id: "d", text: "Hashing every document on its first few characters." },
    ],
    answerId: "c",
    explanation:
      "Prefix indexing is exact: indexing a set under its first $\\lfloor (1-J)L_s \\rfloor + 1$ symbols provably cannot miss a pair at similarity $J$ or above. LSH always risks false negatives, and it is most useful precisely when the similarity you accept is relatively low.",
  },
  {
    id: "q-blocking",
    prompt:
      "In the Company A versus Company B dispute, what played the role of the locality-sensitive hash functions?",
    options: [
      { id: "a", text: "Minhash signatures of the shingled records." },
      { id: "b", text: "Sorting the records by name, then by address, then by phone, and scoring only exact ties." },
      { id: "c", text: "Random hyperplanes over the record vectors." },
      { id: "d", text: "A single hash over the concatenation of all three fields." },
    ],
    answerId: "b",
    explanation:
      "Three 'hash functions' sent records to the same bucket only when the name, the address or the phone matched exactly — implemented as three sort passes. It missed any true pair that agreed exactly on none of the three fields, which was accepted as a deliberate trade-off.",
  },
  {
    id: "q-validation",
    prompt:
      "Perfect 300-point matches averaged a 10-day delay, random pairs 45 days, so the true-match fraction at average delay x is (45 − x)/35. A score band averages 31 days. What fraction of those pairs are real matches?",
    options: [
      { id: "a", text: "About 0.11" },
      { id: "b", text: "About 0.40" },
      { id: "c", text: "About 0.69" },
      { id: "d", text: "It cannot be estimated without labelled data." },
    ],
    answerId: "b",
    explanation:
      "$(45 - 31)/35 = 14/35 = 0.4$. The trick needs only a field that is *not* part of the score and that differs on average between true and false pairs — creation dates here, but height or any similar attribute would work the same way.",
  },
];
