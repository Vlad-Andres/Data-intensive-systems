import type { Block, SectionBlocks } from "@/content/types";
import { lecture01Meta, lecture01Outline } from "./meta";
import { BandTuner } from "./interactive/BandTuner";
import { ClusteringThreshold } from "./interactive/ClusteringThreshold";
import { ErPipeline } from "./interactive/ErPipeline";
import { MinhashLab } from "./interactive/MinhashLab";
import { PairCostCalculator } from "./interactive/PairCostCalculator";
import { ShinglingExplorer } from "./interactive/ShinglingExplorer";
import { StringSimilarityLab } from "./interactive/StringSimilarityLab";

const objectives: Block[] = [
  {
    kind: "prose",
    md: "This lecture merges the entity-resolution slides with chapter 3 of *Mining of Massive Datasets*. The two halves fit together: the slides pose the problem, the chapter supplies the machinery that makes it tractable.",
  },
  { kind: "list", variant: "objectives", items: lecture01Meta.objectives },
];

const bigPicture: Block[] = [
  {
    kind: "prose",
    md: "Start with a single city. *London* is written as Londres, Londra, Londyn, Lontoo, ロンドン, Лондон and a hundred other strings, and it is also described as *the capital of the UK*, *the host city of the IV Olympic Games* and *the city of the Westminster Abbey*. One entity, unbounded descriptions.\n\nNow run it the other way. A gazetteer lists London KY, London OH, London AR, London TX, London MO, London MI, plus dozens of unincorporated Londons — and a phone book lists Jack London in Montgomery AL twice, at two addresses, with the same phone number. One string, many entities.",
  },
  {
    kind: "info",
    variant: "insight",
    title: "The definition, in one line",
    md: "**Entity resolution** is deciding whether two data structures correspond to the same real-world entity. Everything else in this lecture is about doing that decision cheaply enough to be useful.",
  },
  {
    kind: "prose",
    md: "Descriptions diverge for two kinds of reason. **Text variations** — misspellings, acronyms, transformations, abbreviations — are the visible symptom. **Local knowledge** is the real cause: every source picks its own format (a person as an author of a publication is not formatted like a person in an email header), and nobody coordinates identifier assignment globally.\n\nThe typical methodology therefore has three steps: identify the data describing the same real-world objects, decide how to merge that data, and update the data collection. Solutions fall into four families — atomic similarity, similarity for sets, methods exploiting inner relationships, and methods for uncertain data.",
  },
  {
    kind: "interactive",
    title: "The quadratic wall",
    description:
      "Before any clever technique, see what brute force actually costs. Move the sliders and watch the wall arrive.",
    component: PairCostCalculator,
  },
  { kind: "concepts", ids: ["entity-resolution", "why-hard"] },
];

const stringSimilarity: Block[] = [
  {
    kind: "prose",
    md: "The first family of solutions compares field values directly. Two classic targets: publication authors, where *John D. Smith* must match *J. D. Smith*, and journal names, where *Transactions on Knowledge and Data Engineering* must match *Trans. Knowl. Data Eng.*\n\n**Edit distance** counts the operations needed to convert one string into the other. In the Levenshtein formulation, delete, insert and update each cost 1. It is a genuine distance measure: non-negative, zero only for identical strings, symmetric, and it obeys the triangle inequality because turning $s$ into $t$ via $u$ can never be cheaper than going straight.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Edit distance punishes abbreviation",
    md: "Shortening *knowledge and data* to *knowl. data* costs one edit per deleted character. **Gap distance** fixes this by adding two operations — open a gap, and extend a gap at a small cost — so the total becomes $1 + o + 8e$ rather than nine full deletions.",
  },
  {
    kind: "prose",
    md: "For short strings such as first and last names, **Jaro similarity** works better. It counts the characters $C$ that the two strings have in common and the transpositions $T$ (positions where both strings have a common character but in swapped order, counted as halves).",
  },
  {
    kind: "formula",
    tex: "Jaro(s_1, s_2) = \\frac{1}{3}\\left(\\frac{C}{|s_1|} + \\frac{C}{|s_2|} + \\frac{C - T}{C}\\right)",
    caption: "For DEIS versus DESI: C = 4, T = 2/2 = 1, giving (1 + 1 + 0.75)/3 = 0.9167.",
  },
  {
    kind: "prose",
    md: "**Jaro-Winkler** extends this by giving a matching prefix extra weight, which raises its accuracy on personal names in particular.",
  },
  {
    kind: "interactive",
    title: "String similarity lab",
    description:
      "Compare four measures on the same pair of strings, and watch the dynamic-programming table that produces the edit distance.",
    component: StringSimilarityLab,
  },
  {
    kind: "info",
    variant: "note",
    title: "Two definitions of edit distance",
    md: "The slides define edit distance with insert, delete **and** update. The book uses insert and delete only, which makes $d(x,y) = |x| + |y| - 2|LCS(x,y)|$. For *abcde* and *acfdeg* the longest common subsequence is *acde*, so the distance is $5 + 6 - 8 = 3$. Both versions are distance measures; know which one a question means.",
  },
  { kind: "concepts", ids: ["edit-distance", "gap-distance", "jaro"] },
];

const setsAndShingling: Block[] = [
  {
    kind: "prose",
    md: "Atomic similarity does not scale, and it does not handle whole documents. The second family reframes the problem: **see every entity as a set, and reduce finding similar items to finding similar sets.** That single move covers an astonishing range of problems — near-duplicate web pages, plagiarism detection, clustering news articles by story, customers who bought similar products, movies with similar sets of fans, and entity resolution itself.\n\nA set of important words turns out not to work: it throws away order. **Shingling** keeps it.",
  },
  {
    kind: "prose",
    md: "A **k-shingle** (or k-gram) for a document is any substring of length $k$ that occurs in it, where the tokens may be characters, words or anything else. A document is represented by the *set* of its shingles — duplicates collapse.\n\nFor $k = 2$ and the document *abcdabd*, the 2-shingles are {ab, bc, cd, da, bd}: *ab* occurs twice but appears once in the set. Two documents that are intuitively similar share many shingles, because changing a word only affects shingles within distance $k$ of it, and reordering paragraphs only affects the $2k$ shingles crossing the boundaries.",
  },
  {
    kind: "info",
    variant: "warning",
    title: "Choosing k, and what to do about whitespace",
    md: "Pick $k$ large enough that the probability of any given shingle appearing in any given document is low. With $k = 1$ almost every web page shares almost every character. Around $k = 5$ suits emails ($27^5 \\approx 14$ million possible shingles); $k = 9$ is considered safe for research articles. Because common letters dominate, a good rule of thumb is to estimate the space as $20^k$, not $27^k$.\n\nReplace runs of whitespace with a single blank rather than deleting it: with $k = 9$, *touch dow* and *ouch down* should not collapse into *touchdown*.",
  },
  {
    kind: "interactive",
    title: "Shingling explorer",
    description:
      "Change k, switch between character and word tokens, and watch which shingles two documents actually share.",
    component: ShinglingExplorer,
  },
  {
    kind: "prose",
    md: "Sets of shingles are still large — roughly the size of the document. **Hashing** compacts them: map each 9-shingle to a bucket in $[0, 2^{32}-1]$ and represent it by four bytes instead of nine. Two documents can then rarely appear to share a shingle when in fact only the hash values collided.\n\nCounter-intuitively, hashing 9-shingles to four bytes discriminates *better* than using 4-shingles directly, even though both cost four bytes: only about $20^4 = 160{,}000$ 4-shingles are likely to occur in English, while 9-shingles fill the whole 32-bit range.",
  },
  {
    kind: "formula",
    tex: "SIM(C_1, C_2) = \\frac{|C_1 \\cap C_2|}{|C_1 \\cup C_2|} \\qquad d(C_1, C_2) = 1 - SIM(C_1, C_2)",
    caption: "Jaccard similarity and Jaccard distance.",
  },
  {
    kind: "prose",
    md: "Encode the sets as 0/1 vectors over the universal set and the picture becomes a **characteristic matrix**: rows are elements (for example, all possible k-shingles), columns are sets, and a cell is 1 when that element belongs to that set. Intersection is bitwise AND, union is bitwise OR. The matrix is almost always extremely sparse and is never actually materialised — it is a way of thinking, not a storage format.\n\nClassify the rows of two columns and Jaccard similarity becomes a counting argument.",
  },
  {
    kind: "table",
    headers: ["Row type", "C₁", "C₂", "Counts towards"],
    rows: [
      ["a", "1", "1", "intersection and union"],
      ["b", "1", "0", "union only"],
      ["c", "0", "1", "union only"],
      ["d", "0", "0", "nothing"],
    ],
    caption: "SIM(C₁, C₂) = a / (a + b + c). Type-d rows — the vast majority — are irrelevant.",
  },
  { kind: "concepts", ids: ["shingling", "hashed-shingles", "jaccard", "characteristic-matrix"] },
];

const minhashing: Block[] = [
  {
    kind: "prose",
    md: "Shingle sets are too big to compare directly, so replace each set by a **signature**: a short integer vector that preserves similarity. The construction is minhashing.\n\nImagine the rows of the characteristic matrix permuted at random. Define $h(C)$ as the number of the first row, in the permuted order, in which column $C$ has a 1. Use many independent permutations and the results form the **signature matrix**: columns are still the sets, rows are now minhash values.",
  },
  {
    kind: "info",
    variant: "insight",
    title: "Why minhashing works at all",
    md: "$P[h(C_1) = h(C_2)] = SIM(C_1, C_2)$.\n\nLook down the permuted columns until you see a 1. If that row is type a, the two minhashes are equal; if it is type b or c, they are not; type-d rows are skipped. So the probability is $a/(a+b+c)$ — exactly the Jaccard similarity. The similarity of two signatures is the fraction of rows in which they agree, and its **expected** value is the Jaccard similarity of the sets. Longer signatures shrink the expected error.",
  },
  {
    kind: "interactive",
    title: "Minhash signature builder",
    description:
      "The worked example from the lecture. Step through the rows and watch the signature slots fall from infinity. Click any 0/1 cell to change the input and see what happens.",
    component: MinhashLab,
  },
  {
    kind: "prose",
    md: "Actually permuting the rows is out of the question. With a billion rows, representing one random permutation takes a billion entries, and accessing rows in permuted order thrashes the memory hierarchy. **Row hashing** replaces it: pick $n$ hash functions, and treat the ordering induced by each one as a random permutation.",
  },
  {
    kind: "code",
    lang: "python",
    code: `# One pass over the rows builds every signature at once.
for i in range(n_hashes):
    for c in columns:
        M[i][c] = INFINITY

for r in rows:
    h = [hash_i(r) for hash_i in hashes]
    for c in columns:
        if matrix[r][c] == 1:
            for i in range(n_hashes):
                if h[i] < M[i][c]:
                    M[i][c] = h[i]`,
    caption: "Keep one slot per column and hash function, scan the rows once, and lower the slot whenever a 1 hashes below it.",
  },
  {
    kind: "steps",
    title: "Hand-trace the lecture example",
    intro:
      "Rows 1-5, two columns, $h(x) = x \\bmod 5$ and $g(x) = (2x+1) \\bmod 5$. Column $C_1$ has 1s in rows 1, 3, 4; column $C_2$ in rows 2, 3, 5.",
    steps: [
      {
        title: "Initialise every slot to infinity",
        md: "$sig(C_1) = [\\infty, \\infty]$ and $sig(C_2) = [\\infty, \\infty]$. Nothing has been seen yet.",
      },
      {
        title: "Row 1 — h(1) = 1, g(1) = 3",
        md: "Only $C_1$ has a 1, so $sig(C_1) = [1, 3]$. $C_2$ is untouched.",
      },
      {
        title: "Row 2 — h(2) = 2, g(2) = 0",
        md: "Only $C_2$ has a 1, so $sig(C_2) = [2, 0]$.",
      },
      {
        title: "Row 3 — h(3) = 3, g(3) = 2",
        md: "Both columns have a 1. For $C_1$, 3 is not below 1 but 2 is below 3, so $sig(C_1) = [1, 2]$. For $C_2$, neither 3 nor 2 improves on $[2, 0]$.",
      },
      {
        title: "Row 4 — h(4) = 4, g(4) = 4",
        md: "Only $C_1$ has a 1, and neither 4 improves on $[1, 2]$. Nothing changes.",
      },
      {
        title: "Row 5 — h(5) = 0, g(5) = 1",
        md: "Only $C_2$ has a 1. Now $0 < 2$, so the first slot drops: $sig(C_2) = [0, 0]$.",
      },
      {
        title: "Read off the result",
        md: "$sig(C_1) = [1, 2]$ and $sig(C_2) = [0, 0]$ — they agree in zero rows. The true Jaccard similarity is $1/5 = 0.2$, because only row 3 is type a while rows 1, 2, 4 and 5 are type b or c. Two hash functions is simply not enough to estimate 0.2; this is the noise that 100 hashes averages away.",
      },
    ],
  },
  { kind: "concepts", ids: ["minhash", "signature-matrix", "row-hashing"] },
];

const lsh: Block[] = [
  {
    kind: "prose",
    md: "Signatures solve the *space* problem but not the *pairs* problem. A million documents with signatures of length 250 fit in a gigabyte, yet there are still half a trillion pairs of documents; at a microsecond per comparison that is almost six days.\n\nIf you genuinely need every pair's similarity, nothing can help. But usually you want only the pairs above some similarity bound — and then **locality-sensitive hashing** applies: hash the items many times, in a way that makes similar items far likelier to share a bucket, and only examine the **candidate pairs** that collide at least once.",
  },
  {
    kind: "prose",
    md: "For minhash signatures, the effective hashing is **banding**. Divide the signature matrix into $b$ bands of $r$ rows each. For every band, hash each column's $r$-row slice into a bucket array — a *separate* array per band, so identical slices in different bands never collide. With enough buckets, we can assume two slices land together exactly when they are identical.\n\nTwo columns that differ in band 1 still have $b - 1$ further chances. The more similar they are, the likelier one of those chances pays off.",
  },
  {
    kind: "formula",
    tex: "P[\\text{candidate pair}] = 1 - \\left(1 - s^{\\,r}\\right)^{b}",
    caption: "Agree in all r rows of a band with probability sʳ; miss every one of the b bands with probability (1 − sʳ)ᵇ.",
  },
  {
    kind: "interactive",
    title: "Band tuner",
    description:
      "Drag b and r and watch the S-curve move. The dashed line marks the threshold (1/b)^(1/r) where the probability crosses one half.",
    component: BandTuner,
  },
  {
    kind: "steps",
    title: "Why b = 20, r = 5 is a good default",
    intro: "Signatures of length 100, split into twenty bands of five rows.",
    steps: [
      {
        title: "Locate the threshold",
        md: "$(1/b)^{1/r} = (1/20)^{1/5} \\approx 0.549$ — just above one half. Pairs above it are very likely to be candidates, pairs below are unlikely.",
      },
      {
        title: "Take a genuinely similar pair, s = 0.8",
        md: "$s^5 = 0.328$, so the chance of agreeing in all five rows of one band is about 33%. Missing that band happens with probability $1 - 0.328 = 0.672$.",
      },
      {
        title: "Miss all twenty bands",
        md: "$0.672^{20} \\approx 0.00035$. So $P[\\text{candidate}] \\approx 0.99965$: only about one in 3000 pairs at 80% similarity is a false negative.",
      },
      {
        title: "Check the other end, s = 0.2",
        md: "$1 - (1 - 0.2^5)^{20} \\approx 0.006$. Six in a thousand dissimilar pairs get scored unnecessarily — cheap insurance.",
      },
      {
        title: "Read the slope",
        md: "The curve rises by more than 0.6 between $s = 0.4$ and $s = 0.6$, so the slope in the middle exceeds 3. It is not the ideal step function, but it is steep where it matters.",
      },
    ],
  },
  {
    kind: "table",
    headers: ["s", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8"],
    rows: [["1 − (1 − s⁵)²⁰", ".006", ".047", ".186", ".470", ".802", ".975", ".9996"]],
    caption: "The S-curve for b = 20, r = 5 (Mining of Massive Datasets, Figure 3.9).",
  },
  {
    kind: "info",
    variant: "warning",
    title: "Pick the threshold deliberately",
    md: "Choose $b$ and $r$ with $br = n$ so that $(1/b)^{1/r}$ lands near your target similarity $t$. If **missing pairs is expensive**, aim for a threshold *below* $t$ and accept more false positives. If **scoring candidates is expensive**, aim *above* $t$. LSH is most valuable when the similarity you accept is relatively low.",
  },
  { kind: "concepts", ids: ["lsh", "banding", "s-curve"] },
];

const pipeline: Block[] = [
  {
    kind: "prose",
    md: "Put the pieces together and the whole method is a short recipe. Nothing in it is optional except the last step, and every step has a knob that trades accuracy for speed.",
  },
  {
    kind: "timeline",
    items: [
      {
        label: "Step 1",
        title: "Shingle",
        md: "Pick $k$ and build the set of k-shingles for each document. Optionally hash the shingles to shorter bucket numbers.",
      },
      {
        label: "Step 2",
        title: "Sort by shingle",
        md: "Order the document-shingle pairs so the signature pass can stream over them.",
      },
      {
        label: "Step 3",
        title: "Minhash",
        md: "Pick a signature length $n$ and compute all signatures in one pass using row hashing.",
      },
      {
        label: "Step 4",
        title: "Choose b and r",
        md: "Fix the similarity threshold $t$ you want, then pick $b$ and $r$ with $br = n$ and $(1/b)^{1/r} \\approx t$ — lower to avoid false negatives, higher to limit false positives.",
      },
      {
        label: "Step 5",
        title: "Band and bucket",
        md: "Apply LSH to the signature matrix and collect the candidate pairs.",
      },
      {
        label: "Step 6",
        title: "Check the signatures",
        md: "For each candidate, measure the fraction of signature components that agree and keep those at or above $t$.",
      },
      {
        label: "Step 7",
        title: "Verify on the real data (optional)",
        md: "Go back to the documents themselves to rule out pairs that merely got lucky in their signatures.",
      },
    ],
  },
  {
    kind: "interactive",
    title: "Pipeline explorer",
    description:
      "Click a stage to see what it produces, why it works, and what it costs. Watch how the data volume collapses from N² to something you can afford.",
    component: ErPipeline,
  },
];

const records: Block[] = [
  {
    kind: "prose",
    md: "Records are not documents. Their similarity fits neither the similar-sets nor the similar-vectors model that the theory is built on, so real entity resolution adapts the idea rather than applying it verbatim.\n\nThe canonical example: Company A solicited customers for Company B, then the two quarrelled over how many customers A had actually delivered. Each held about a million records with names, addresses and phone numbers — and no field saying *this is a customer A provided*. A trillion pairs, and no ground truth.",
  },
  {
    kind: "prose",
    md: "**Scoring.** Each of the three fields was worth 100 points, so an exact match everywhere scored 300. Mismatches were deducted using edit distance, with the penalty growing *quadratically* in the distance. Public tables then softened specific cases: *Bill* and *William* were treated as differing in one letter, though their edit distance is 5.\n\n**Blocking.** Scoring a trillion pairs was impossible, so three crude hash functions were used: one sent records to the same bucket only when names matched exactly, one for addresses, one for phone numbers. In practice there was no hashing at all — the records were sorted three times and consecutive ties were scored. This misses any true pair that matches exactly on none of the three fields, which was accepted: a judge would not have believed such a pair anyway.",
  },
  {
    kind: "steps",
    title: "Validating the matches without labels",
    intro:
      "How do you decide which score is high enough, when nobody ever labelled the data? Use a field that is *not* part of the score.",
    steps: [
      {
        title: "Find an unused signal",
        md: "Record creation dates. A subscription bought at A and registered at B could not lag by more than 90 days, so a random constrained pair has an average delay of 45 days.",
      },
      {
        title: "Anchor on the certain matches",
        md: "Pairs scoring a perfect 300 had an average delay of 10 days. Assume those are all genuine.",
      },
      {
        title: "Interpolate",
        md: "For a score band whose average delay is $x$, with a true-match fraction $f$: $x = 10f + 45(1-f) = 45 - 35f$, so $f = (45 - x)/35$.",
      },
      {
        title: "Read the answer off",
        md: "Down to a score of 185, $x$ stayed near 10 — those pairs are essentially certain. A score of 185 means one field identical, one completely different, and one with a small discrepancy. Even at 115, $x$ was noticeably below 45, so some of those were real too.",
      },
      {
        title: "Generalise the trick",
        md: "It works whenever there is a scoring system **and** some field outside it whose value differs on average between true and false pairs. With heights: $f = (h_1 - h)/(h_1 - h_0)$, where $h_0$ is the average difference for perfect matches and $h_1$ for random pairs.",
      },
    ],
  },
  {
    kind: "prose",
    md: "**Clustering and merging.** Pairwise scores are not the end. Deduplication computes pairwise similarity, clusters the similar records, and merges each cluster into one unified record — and then the data collection itself has to be updated. Clustering is where the threshold really bites, because matches close transitively: if $P_1$ matches $P_2$ and $P_2$ matches $P_5$, all three land in one entity even if $P_1$ and $P_5$ were never compared directly.",
  },
  {
    kind: "interactive",
    title: "Threshold, clusters and the clean relation",
    description:
      "Six records, seven scored pairs. Move the threshold and watch clusters form by transitive closure — and the merged relation change with them.",
    component: ClusteringThreshold,
  },
  { kind: "concepts", ids: ["blocking", "match-validation", "clustering-merge"] },
];

const distances: Block[] = [
  {
    kind: "prose",
    md: "LSH is not tied to Jaccard. It generalises to any space with a distance measure — a function that is non-negative, zero only for identical points, symmetric, and obeys the triangle inequality.",
  },
  {
    kind: "table",
    headers: ["Measure", "Applies to", "Definition", "Example"],
    rows: [
      ["Jaccard distance", "Sets", "1 − |x ∩ y| / |x ∪ y|", "C₁ = 10111, C₂ = 10011 → 1 − 3/4 = 0.25"],
      ["Edit distance", "Strings", "Cheapest insert/delete script; |x| + |y| − 2·|LCS|", "abcde → acfdeg costs 3"],
      ["Hamming distance", "Vectors", "Number of differing components", "10101 versus 11110 → 3"],
      ["Cosine distance", "Vectors", "arccos( x·y / (‖x‖‖y‖) )", "[1,2,−1] and [2,1,1] → cos = 1/2 → 60°"],
      ["Euclidean distance", "Points in ℝⁿ", "L₂ norm of the difference", "The everyday straight line"],
    ],
  },
  {
    kind: "info",
    variant: "note",
    title: "Most of these spaces are not Euclidean",
    md: "There is no meaningful average of two sets, and no average of two strings. That matters later: clustering algorithms that rely on centroids cannot be used directly in these spaces. Vector spaces with real components are Euclidean; restrict the components to integers and they are not.",
  },
  {
    kind: "prose",
    md: "The general condition is stated over a space $S$ with distance $d$. A family of hash functions is **$(d_1, d_2, p_1, p_2)$-sensitive** if, for any two points $x$ and $y$ and every $h$ in the family:",
  },
  {
    kind: "formula",
    tex: "d(x,y) \\le d_1 \\Rightarrow P[h(x)=h(y)] \\ge p_1 \\qquad d(x,y) \\ge d_2 \\Rightarrow P[h(x)=h(y)] \\le p_2",
    caption: "For minhash under Jaccard distance, P[h(x) = h(y)] = 1 − d(x, y) exactly.",
  },
  {
    kind: "prose",
    md: "Banding is the standard way of **amplifying** such a family: the AND-construction within a band and the OR-construction across bands push $p_1$ towards 1 and $p_2$ towards 0, which is precisely what turns a weak guarantee into the S-curve. The same amplification applies to families built for Hamming distance, for cosine distance via random hyperplanes, and for Euclidean distance.",
  },
  { kind: "concepts", ids: ["distance-measure", "other-distances", "lsh-family"] },
];

const highSimilarity: Block[] = [
  {
    kind: "prose",
    md: "LSH earns its keep when the similarity you accept is relatively low. When you want sets that are *almost identical* — say Jaccard similarity at least 0.9 — there are faster methods, and they are **exact**: no false negatives at all.\n\nFirst represent a set as a string: fix an order on the universal set and list the set's elements in that order. Such strings never repeat a character, and shared characters always appear in the same relative order.",
  },
  {
    kind: "prose",
    md: "**Length-based filtering.** Sort the strings by length. The intersection of $s$ and $t$ cannot exceed $L_s$, and their union is at least $L_t$, so $SIM(s,t) \\le L_s / L_t$. For the pair to be worth comparing at all, $L_t \\le L_s / J$.\n\n**Prefix indexing.** Index each string under its first $p = \\lfloor (1-J) L_s \\rfloor + 1$ symbols. If $t$ shared none of those, the best it could be is the suffix of $s$ after the prefix, giving similarity $(L_s - p)/L_s$, which is below $J$ by construction.",
  },
  {
    kind: "steps",
    title: "Prefix indexing at J = 0.9",
    steps: [
      {
        title: "Compute the prefix length",
        md: "For $L_s = 9$: $p = \\lfloor 0.1 \\times 9 \\rfloor + 1 = 1$. The string is indexed under its first symbol only.",
      },
      {
        title: "Check the escape routes",
        md: "Take $s = bcdefghij$. A string $t$ starting with *a* can only reach 0.9 if it is $abcdefghij$ — but that has length 10, so $p = 2$ and it is indexed under both *a* and *b*. The pair is found.",
      },
      {
        title: "Check the other direction",
        md: "If $t$ starts with *c* or later, the best case is $t = cdefghij$, giving $SIM = 8/9 < 0.9$. No comparison needed.",
      },
      {
        title: "Combine with length filtering",
        md: "At $J = 0.9$ a string of length 9 is only compared with strings of length 9 and 10, since $9/0.9 = 10$. Strings of length 10-19 are indexed under two symbols, 20-29 under three, and so on.",
      },
      {
        title: "Order the symbols rarest first",
        md: "Instead of lexicographic order, count how often each element occurs across all sets and order by that count, lowest first. Prefixes then contain rare symbols, so the index buckets they fall into are small.",
      },
    ],
  },
  {
    kind: "info",
    variant: "note",
    title: "For truly identical items",
    md: "Hashing on the first few characters breaks when every document starts with the same HTML header. Hashing the entire document works but reads every byte. The practical compromise is to hash a fixed set of random positions — and never compare two documents whose lengths differ significantly.",
  },
  { kind: "concepts", ids: ["length-filtering", "prefix-indexing"] },
];

const mistakes: Block[] = [
  {
    kind: "info",
    variant: "pitfall",
    title: "Confusing similarity with distance",
    md: "Jaccard **similarity** is intersection over union; Jaccard **distance** is one minus that. The S-curve is drawn against similarity, but the locality-sensitive family definition is stated in terms of distance. Read the axis label before answering.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Thinking a candidate pair is a match",
    md: "LSH only produces pairs *worth examining*. Candidates still have to be scored, and pairs above the threshold may still be checked against the original documents. Skipping that step means shipping every false positive.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Treating false negatives as a bug",
    md: "They are the deliberate price of avoiding the quadratic comparison. The only question is how many you are willing to lose, and that is what choosing $b$ and $r$ decides. If you cannot lose any, use prefix indexing instead — but only high similarity thresholds make that affordable.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Estimating similarity from a short signature",
    md: "The expected signature similarity equals the Jaccard similarity, but the variance at $n = 2$ or $n = 5$ is enormous — the lecture example estimates 0.2 as 0.0. Unbiased is not the same as accurate.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Forgetting that clustering is transitive",
    md: "A threshold that looks safe pairwise can merge two clearly different entities through a chain of intermediate records. Always look at the clusters the threshold produces, not just at the pairs it accepts.",
  },
];

const quiz: Block[] = [
  {
    kind: "prose",
    md: "Ten questions covering the whole chain, from the quadratic wall to prefix indexing. A wrong answer you understand afterwards is worth more than a lucky guess, so read every explanation.",
  },
];

const summary: Block[] = [
  { kind: "list", variant: "takeaways", items: lecture01Meta.takeaways },
  {
    kind: "table",
    headers: ["Quantity", "Formula", "Where it shows up"],
    rows: [
      ["Pairs to compare", "N(N−1)/2", "The reason for everything that follows"],
      ["Jaccard similarity", "|C₁ ∩ C₂| / |C₁ ∪ C₂| = a/(a+b+c)", "Set overlap after shingling"],
      ["Jaccard distance", "1 − SIM(C₁, C₂)", "LSH family definitions"],
      ["Jaro similarity", "⅓(C/|s₁| + C/|s₂| + (C−T)/C)", "Short strings, names"],
      ["Indel edit distance", "|x| + |y| − 2·|LCS(x, y)|", "The book's edit distance"],
      ["Minhash property", "P[h(C₁) = h(C₂)] = SIM(C₁, C₂)", "Why signatures preserve similarity"],
      ["Banding probability", "1 − (1 − sʳ)ᵇ", "The S-curve"],
      ["LSH threshold", "(1/b)^(1/r)", "Tuning b and r"],
      ["Length filter", "Lₜ ≤ Lₛ / J", "Exact high-similarity search"],
      ["Prefix length", "⌊(1 − J)·Lₛ⌋ + 1", "Prefix indexing"],
    ],
    caption: "Everything worth memorising from this lecture, in one place.",
  },
  {
    kind: "info",
    variant: "insight",
    title: "The one sentence version",
    md: "Turn items into sets, compress the sets into signatures that preserve Jaccard similarity, band the signatures so that only plausibly similar pairs ever meet, and spend your expensive scoring function only on those.",
  },
];

export const lecture01Blocks: SectionBlocks<typeof lecture01Outline> = {
  objectives,
  "big-picture": bigPicture,
  "string-similarity": stringSimilarity,
  "sets-and-shingling": setsAndShingling,
  minhashing,
  lsh,
  pipeline,
  records,
  distances,
  "high-similarity": highSimilarity,
  mistakes,
  quiz,
  summary,
};
