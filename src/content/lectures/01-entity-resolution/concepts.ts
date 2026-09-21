import type { Concept } from "@/content/types";

export const lecture01Concepts: Concept[] = [
  {
    id: "entity-resolution",
    term: "Entity resolution",
    short: "Deciding whether two data structures describe the same real-world entity.",
    detail:
      "The methodology has three parts: identify the data that describes the same object, decide how to merge it, and update the data collection. It travels under many names — record linkage, deduplication, entity linkage, reference reconciliation.",
    tags: ["definition"],
  },
  {
    id: "why-hard",
    term: "Why descriptions diverge",
    short: "Text variations plus local knowledge produce many names for one entity.",
    detail:
      "Text variations cover misspellings, acronyms, transformations and abbreviations. Local knowledge is the deeper cause: every source picks its own format, and nobody coordinates identifier assignment globally.",
    tags: ["motivation"],
  },
  {
    id: "edit-distance",
    term: "Edit distance",
    short: "The cheapest sequence of character edits that turns one string into another.",
    detail:
      "In the Levenshtein formulation, delete, insert and update each cost 1. The book uses an insert/delete-only variant, where $d(x,y) = |x| + |y| - 2 \\cdot |LCS(x,y)|$. Both are proper distance measures.",
    tags: ["atomic similarity"],
  },
  {
    id: "gap-distance",
    term: "Gap distance",
    short: "Edit distance plus cheap 'open gap' and 'extend gap' operations.",
    detail:
      "Plain edit distance punishes abbreviations badly: turning 'knowledge and data' into 'knowl. data' costs one edit per deleted character. Charging once to open a gap and a small amount per extension keeps abbreviated names close to their full forms.",
    tags: ["atomic similarity"],
  },
  {
    id: "jaro",
    term: "Jaro and Jaro-Winkler similarity",
    short: "A similarity tuned for short strings such as first and last names.",
    detail:
      "With $C$ common characters and $T$ transpositions, $Jaro(s_1,s_2) = \\frac{1}{3}\\left(\\frac{C}{|s_1|} + \\frac{C}{|s_2|} + \\frac{C-T}{C}\\right)$. Jaro-Winkler adds extra weight for a matching prefix, which suits personal names.",
    tags: ["atomic similarity"],
  },
  {
    id: "shingling",
    term: "k-shingles",
    short: "The set of all length-k substrings (or word sequences) occurring in a document.",
    detail:
      "Shingling turns lexical similarity into set overlap and survives reordering: moving a paragraph only changes the $2k$ shingles that cross its boundaries. Pick $k$ large enough that any given shingle is unlikely in any given document — about 5 for emails, 9 for long articles.",
    tags: ["sets"],
  },
  {
    id: "hashed-shingles",
    term: "Hashed shingles",
    short: "Replace each shingle by a bucket number so a set costs four bytes per element.",
    detail:
      "Hashing 9-shingles down to 32 bits discriminates better than using 4-shingles directly, even though both cost four bytes: only about $20^4$ 4-shingles actually occur in English text, while 9-shingles fill the whole 32-bit space.",
    tags: ["sets"],
  },
  {
    id: "jaccard",
    term: "Jaccard similarity and distance",
    short: "Intersection over union; distance is one minus the similarity.",
    detail:
      "$SIM(C_1,C_2) = \\frac{|C_1 \\cap C_2|}{|C_1 \\cup C_2|}$ and $d(C_1,C_2) = 1 - SIM(C_1,C_2)$. Classifying rows as type a (1,1), b (1,0), c (0,1), d (0,0) gives $SIM = \\frac{a}{a+b+c}$ — type-d rows are ignored.",
    tags: ["sets", "distance"],
  },
  {
    id: "characteristic-matrix",
    term: "Characteristic matrix",
    short: "Rows are elements of the universal set, columns are sets, cells are 0/1.",
    detail:
      "The matrix is a conceptual device, not a storage format: it is almost always extremely sparse, so real systems store the sets themselves. Set intersection becomes bitwise AND and union becomes bitwise OR.",
    tags: ["sets"],
  },
  {
    id: "minhash",
    term: "Minhashing",
    short: "Permute the rows; the minhash of a column is the first row in which it has a 1.",
    detail:
      "The defining property is that $P[h(C_1) = h(C_2)] = SIM(C_1, C_2)$: looking down the permuted columns until the first 1 appears, the hashes agree exactly on type-a rows, so the probability is $a/(a+b+c)$.",
    tags: ["signatures"],
  },
  {
    id: "signature-matrix",
    term: "Signature matrix",
    short: "One short integer vector per set, built from many independent minhash functions.",
    detail:
      "Signature similarity is the fraction of rows in which two signatures agree, and its expected value is the Jaccard similarity of the underlying sets. Longer signatures reduce the expected error; 100 hash functions is typical.",
    tags: ["signatures"],
  },
  {
    id: "row-hashing",
    term: "Row hashing",
    short: "Simulate random permutations with hash functions in a single pass.",
    detail:
      "Materialising a permutation of a billion rows is impossible, and accessing rows in permuted order thrashes. Instead, keep a slot per column and hash function initialised to infinity, scan rows once, and lower the slot whenever a row with a 1 hashes below the current value.",
    tags: ["signatures", "implementation"],
  },
  {
    id: "lsh",
    term: "Locality-sensitive hashing",
    short: "Hash items many times so that similar items are far likelier to share a bucket.",
    detail:
      "Anything landing in the same bucket for at least one hashing becomes a candidate pair, and only candidates are scored. Dissimilar pairs that collide are false positives; similar pairs that never collide are false negatives.",
    tags: ["lsh"],
  },
  {
    id: "banding",
    term: "The banding technique",
    short: "Split the signature matrix into b bands of r rows and hash each band separately.",
    detail:
      "Each band gets its own bucket array, so identical band vectors in different bands never collide. Two columns become candidates if they agree in all $r$ rows of at least one band.",
    tags: ["lsh"],
  },
  {
    id: "s-curve",
    term: "The S-curve",
    short: "A pair of similarity s becomes a candidate with probability 1 − (1 − sʳ)ᵇ.",
    detail:
      "The threshold — where the probability reaches one half — is approximately $(1/b)^{1/r}$. With $b=20$ and $r=5$, a pair at $s = 0.8$ is missed only about once in 3000, while a pair at $s = 0.2$ is a candidate with probability 0.006.",
    tags: ["lsh", "analysis"],
  },
  {
    id: "lsh-family",
    term: "(d₁, d₂, p₁, p₂)-sensitive family",
    short: "The formal condition that makes a hash family locality-sensitive.",
    detail:
      "A family is $(d_1,d_2,p_1,p_2)$-sensitive if $d(x,y) \\le d_1$ implies $P[h(x)=h(y)] \\ge p_1$ and $d(x,y) \\ge d_2$ implies $P[h(x)=h(y)] \\le p_2$. For minhash and Jaccard distance, $P[h(x)=h(y)] = 1 - d(x,y)$.",
    tags: ["lsh", "theory"],
  },
  {
    id: "distance-measure",
    term: "Distance measure axioms",
    short: "Non-negative, zero only for identical points, symmetric, and obeys the triangle inequality.",
    detail:
      "Jaccard, edit, Hamming, cosine and Euclidean distances all qualify. Note that several of them are not Euclidean: there is no meaningful average of two sets or of two strings, which matters later for clustering.",
    tags: ["distance", "theory"],
  },
  {
    id: "other-distances",
    term: "Cosine and Hamming distance",
    short: "The angle between two vectors, and the number of differing components.",
    detail:
      "Cosine distance is $\\arccos\\left(\\frac{x \\cdot y}{\\|x\\| \\|y\\|}\\right)$, ranging from 0 to 180 degrees regardless of dimension. Hamming distance counts differing components and is most often used on boolean vectors.",
    tags: ["distance"],
  },
  {
    id: "blocking",
    term: "Blocking",
    short: "Only compare records that already agree on some cheap key.",
    detail:
      "In the Company A / Company B case, records were sorted by name, then by address, then by phone, and only records sharing an exact value were scored. This is LSH with three hand-picked hash functions, and it misses pairs that agree exactly on nothing.",
    tags: ["lsh", "practice"],
  },
  {
    id: "match-validation",
    term: "Validating record matches",
    short: "Use a field outside the score to estimate what fraction of a score band is genuine.",
    detail:
      "Perfect 300-point pairs had an average delay of 10 days; random pairs averaged 45. For a score band with average delay $x$, the true-match fraction is $(45-x)/35$. Any field that differs on average between true and false pairs works the same way.",
    tags: ["practice"],
  },
  {
    id: "clustering-merge",
    term: "Clustering and merging",
    short: "Close matching pairs transitively, then reduce each cluster to one record.",
    detail:
      "Deduplication is a three-step pipeline: compute pairwise similarity, cluster similar records, merge clusters. The merge rule has to decide per field which value survives — majority, most recent, or an aggregate.",
    tags: ["practice"],
  },
  {
    id: "length-filtering",
    term: "Length-based filtering",
    short: "Sort sets by size; s and t can only reach similarity J if Lₜ ≤ Lₛ / J.",
    detail:
      "The intersection cannot exceed $L_s$ and the union is at least $L_t$, so $SIM(s,t) \\le L_s/L_t$. At $J = 0.9$, a set of size 9 need only be compared with sets of size 9 and 10.",
    tags: ["high similarity"],
  },
  {
    id: "prefix-indexing",
    term: "Prefix indexing",
    short: "Index each set under the first ⌊(1−J)·Lₛ⌋ + 1 elements of its sorted representation.",
    detail:
      "If $t$ shared none of those prefix symbols, the best it could do is be the suffix of $s$, giving similarity $(L_s - p)/L_s < J$. Ordering symbols rarest-first makes the prefix buckets small. Unlike LSH, this is exact — no false negatives.",
    tags: ["high similarity"],
  },
];
