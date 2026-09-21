import type { Block, SectionBlocks } from "@/content/types";
import { lecture02Meta, lecture02Outline } from "./meta";
import { FragmentationLab } from "./interactive/FragmentationLab";
import { GreenplumExplorer } from "./interactive/GreenplumExplorer";
import { JoinStrategyExplorer } from "./interactive/JoinStrategyExplorer";
import { QuorumLab } from "./interactive/QuorumLab";
import { SemiJoinBloomLab } from "./interactive/SemiJoinBloomLab";
import { TwoPhaseCommitSimulator } from "./interactive/TwoPhaseCommitSimulator";

const objectives: Block[] = [
  {
    kind: "prose",
    md: "Lecture 1 spread work across machines to find similar items. This lecture spreads the **data** itself, and asks the harder question that follows: once a relation lives on several machines, how do you still get one correct answer out of it?",
  },
  { kind: "list", variant: "objectives", items: lecture02Meta.objectives },
];

const whyClusters: Block[] = [
  {
    kind: "prose",
    md: "A single machine runs into four walls at once. **Space**: a few terabytes. **Performance**: hundreds of GFLOPS. **Geo-locality**: it sits at one point on the planet, and the speed of light does the rest. **Redundancy**: there is none — when it dies, the data is unreachable.\n\nSo we use several machines. The goal is that the cluster presents itself as a single system: the user should not have to know there is more than one.",
  },
  {
    kind: "prose",
    md: "That leaves one big decision — how consistent the illusion has to be.\n\n**ACID** is the strict answer. *Atomicity*: a transaction executes completely or not at all. *Consistency*: transactions cannot introduce inconsistencies. *Isolation*: concurrent transactions cannot see each other. *Durability*: all changes survive.\n\n**BASE** is the relaxed one. *Basically available*: requests may fail. *Soft state*: the state may change over time on its own. *Eventual consistency*: once input stops, the system converges.",
  },
  {
    kind: "info",
    variant: "warning",
    title: "Do not reach for BASE by default",
    md: "ACID costs performance because it needs synchronisation — that part is true. But BASE gives no consistent view of the data, which produces subtle bugs and confuses customers, and it is simply unusable for critical systems such as banking. Before choosing BASE, be sure you really need the performance **and** really do not need the guarantees. Otherwise you will end up implementing ACID in the application layer, where it is harder and slower.",
  },
  { kind: "concepts", ids: ["why-cluster", "acid-base"] },
];

const fragmentation: Block[] = [
  {
    kind: "prose",
    md: "Assume a relational data model. There are two independent things you can do with a relation across a cluster, and they compose freely.\n\n**Replication** keeps multiple copies of the data at different sites, for faster retrieval and fault tolerance. **Fragmentation** partitions a relation into fragments stored at distinct sites. Combine them and the system keeps several identical replicas of each fragment.",
  },
  {
    kind: "prose",
    md: "Fragmentation divides a relation $r$ into fragments $r_1, r_2, \\dots, r_n$ that together contain enough information to reconstruct $r$. There are exactly two ways to cut a table:\n\n**Horizontal fragmentation** assigns each *tuple* of $r$ to one or more fragments — you cut across rows. **Vertical fragmentation** splits the *schema* of $r$ into several smaller schemas — you cut down columns. Every vertical fragment must contain a common candidate key (or superkey) so the join back is lossless; where none exists, add a **tuple-id**, an artificial attribute that serves as one.",
  },
  {
    kind: "interactive",
    title: "Fragmentation lab",
    description:
      "The professors relation from the lecture. Switch between horizontal and vertical, change the predicate or move attributes between fragments, and watch the correctness criteria react.",
    component: FragmentationLab,
  },
  {
    kind: "table",
    headers: ["", "Vertical", "Horizontal"],
    rows: [
      ["fragment with", "π — projection", "σ — selection"],
      ["reconstruct with", "⋈ — join", "∪ — union"],
      ["cuts", "columns (the schema)", "rows (the tuples)"],
      ["needs", "a common candidate key", "decomposition predicates"],
    ],
    caption: "The whole of fragmentation in one table — worth memorising as a unit.",
  },
  { kind: "concepts", ids: ["fragmentation", "horizontal-fragmentation", "vertical-fragmentation"] },
];

const reconstruction: Block[] = [
  {
    kind: "prose",
    md: "A fragmentation of $R$ into $R_1, \\dots, R_n$ has to satisfy three criteria — two mandatory, one negotiable.\n\n**Completeness**: every tuple of $R$ occurs in at least one fragment. **Reconstructability**: $R$ can be recomputed from the fragments — union for horizontal, join for vertical. **Disjointness**: the fragments do not overlap. The third is optional, and it is deliberately given up whenever fragmentation is combined with replication — or whenever the primary key is repeated across vertical fragments.",
  },
  {
    kind: "info",
    variant: "insight",
    title: "Why build all 2ⁿ combinations",
    md: "With $n$ decomposition predicates $p_1, \\dots, p_n$, building one fragment for every combination of each predicate and its negation gives $2^n$ fragments — and makes completeness and disjointness true **by construction**, with nothing left to check. Two predicates already yield four fragments:\n\n$R_1 = \\sigma_{p_1 \\wedge p_2}(R)$, $R_2 = \\sigma_{p_1 \\wedge \\neg p_2}(R)$, $R_3 = \\sigma_{\\neg p_1 \\wedge p_2}(R)$, $R_4 = \\sigma_{\\neg p_1 \\wedge \\neg p_2}(R)$.",
  },
  {
    kind: "steps",
    title: "Fragmenting the professors by faculty",
    intro: "Three decomposition predicates on Department: theology, physics, philosophy.",
    steps: [
      {
        title: "Write the predicates",
        md: "$p_1 \\equiv$ Department = 'Theology', $p_2 \\equiv$ Department = 'Physics', $p_3 \\equiv$ Department = 'Philosophy'.",
      },
      {
        title: "Enumerate all 2³ = 8 combinations",
        md: "In principle there is a fragment for every sign pattern of the three predicates — eight of them.",
      },
      {
        title: "Notice the predicates are mutually exclusive",
        md: "A professor cannot be in two departments, so any combination with two positives is empty. Eight combinations collapse to four non-empty fragments.",
      },
      {
        title: "Read off the fragments",
        md: "$\\text{TheolProfs} = \\sigma_{p_1 \\wedge \\neg p_2 \\wedge \\neg p_3}(R) = \\sigma_{p_1}(R)$, and likewise for physics and philosophy. The conjunctions simplify to single selections.",
      },
      {
        title: "Do not forget the fourth fragment",
        md: "$\\text{OtherProfs} = \\sigma_{\\neg p_1 \\wedge \\neg p_2 \\wedge \\neg p_3}(R)$ catches everyone in none of the three faculties. Drop it and completeness is lost — this is the fragment people forget in exams.",
      },
    ],
  },
  { kind: "concepts", ids: ["fragmentation-correctness", "decomposition-predicates"] },
];

const derived: Block[] = [
  {
    kind: "prose",
    md: "Fragmenting one relation well is easy. Fragmenting two relations that get joined is where it goes wrong.\n\nSuppose the professors are fragmented by faculty, and the lectures are fragmented on their own attribute — hours per week: $\\text{2SWSVorls} = \\sigma_{SWS=2}$, $\\text{3SWSVorls} = \\sigma_{SWS=3}$, $\\text{4SWSVorls} = \\sigma_{SWS=4}$. Each fragmentation is perfectly correct on its own. Together they are a disaster for query processing, because the fragmentation of the lectures has nothing to do with the fragmentation of the professors.",
  },
  {
    kind: "steps",
    title: "From a complete join graph to local joins",
    intro: "The query joins lectures to the professors who read them: select Titel, Name from Vorlesungen, Professoren where gelesenVon = PersNr.",
    steps: [
      {
        title: "Write the plan over the unrelated fragments",
        md: "Every professor fragment might match every lecture fragment, so the plan becomes $\\Pi_{Titel,Name}\\big((\\text{TheolProfs} \\bowtie \\text{2SWSVorls}) \\cup \\cdots \\cup (\\text{PhiloProfs} \\bowtie \\text{4SWSVorls})\\big)$.",
      },
      {
        title: "Count the joins",
        md: "The join graph is **complete**: $3 \\times 3 = 9$ joins. Most of them are empty — a 2-hour lecture read by a theologian contributes nothing to the physics fragment — but you cannot know that without doing the work, and the operands sit on different machines.",
      },
      {
        title: "Derive the second fragmentation from the first",
        md: "Instead of inventing a predicate for the lectures, fragment them **along** the professors using a semi-join: $\\text{TheolVorls} = \\text{Vorlesungen} \\ltimes_{gelesenVon = PersNr} \\text{TheolProfs}$, and the same for physics and philosophy.",
      },
      {
        title: "Watch the join graph fall apart",
        md: "Now each lecture fragment has exactly one possible partner. The plan becomes $\\Pi_{Titel,Name}\\big((\\text{TheolProfs} \\bowtie_p \\text{TheolVorls}) \\cup (\\text{PhysikProfs} \\bowtie_p \\text{PhysikVorls}) \\cup (\\text{PhiloProfs} \\bowtie_p \\text{PhiloVorls})\\big)$ with $p \\equiv (\\text{PersNr} = \\text{gelesenVon})$ — three independent joins, each entirely local to one node.",
      },
    ],
  },
  {
    kind: "info",
    variant: "insight",
    title: "This is the same idea as a co-located join",
    md: "Derived fragmentation is the relational-algebra name for what a distributed system calls **sharding both tables on the join key**. Align the partitioning of the two relations and the join needs no communication; leave them unaligned and every fragment has to meet every other one.",
  },
  { kind: "concepts", ids: ["derived-fragmentation"] },
];

const sharding: Block[] = [
  {
    kind: "prose",
    md: "**Sharding** is horizontal fragmentation applied across the machines of a cluster: every machine holds a chunk of the dataset. It improves query runtimes — especially when no cross-shard communication is needed — and it accommodates datasets larger than any single machine. In exchange, performance now depends heavily on the interconnect.\n\n**Allocation** decides which node stores which fragment. Put the physics lectures and the physics professors on the physics node, the administration data on the administration node, and the derived fragmentation above pays off immediately.",
  },
  {
    kind: "prose",
    md: "Shards can be spread over the machines in several ways: one shard per machine, or several shards per machine — MemSQL, for instance, allocates eight shards to a leaf node. Having **more shards than machines** gives better skew handling, because a hot shard can be moved without moving everything else.\n\nReplication and sharding also combine: each shard is replicated, so you get the throughput and fault tolerance of replication together with the capacity of sharding, at the cost of more resources.",
  },
  {
    kind: "prose",
    md: "None of this should reach the user. **Data transparency** is the degree to which a user may remain unaware of how and where data items are stored, and it comes in three kinds:\n\n- **Fragmentation transparency** — the user queries the relation, not its fragments.\n- **Replication transparency** — the user does not choose which copy to read.\n- **Location transparency** — the user does not name a site.",
  },
  { kind: "concepts", ids: ["sharding", "allocation", "data-transparency"] },
];

const optimization: Block[] = [
  {
    kind: "prose",
    md: "Query processing over fragments requires fragmentation transparency and splits into two roles. The **query translator** generates a plan on the fragments; the **query optimizer** then improves that plan using knowledge of where the fragments live. Conceptually it is two steps: reconstruct the relation from its fragments, then combine that with the algebraic query plan — and then push as much as possible back down.",
  },
  {
    kind: "code",
    lang: "sql",
    code: `SELECT titel
FROM   Vorlesungen v, Professoren p
WHERE  v.gelesenVon = p.persNr
  AND  p.rang = 'C4';`,
    caption: "The running example: titles of the lectures read by full professors.",
  },
  {
    kind: "steps",
    title: "From the naive plan to the optimized one",
    steps: [
      {
        title: "The translator's plan puts the unions at the bottom",
        md: "$\\pi_{titel}\\Big(\\sigma_{p.rang = C4}\\big((\\text{TheolVorls} \\cup \\text{PhysikVorls} \\cup \\text{PhiloVorls}) \\bowtie (\\text{TheolProfs} \\cup \\text{PhysikProfs} \\cup \\text{PhiloProfs})\\big)\\Big)$ — both relations are fully reconstructed first, which means shipping every fragment to one place before anything is filtered.",
      },
      {
        title: "Push the selection down",
        md: "$\\sigma_{rang = C4}$ touches only Professoren, so it can move below the join and into each professor fragment. Each node now filters its own, much smaller, set of professors.",
      },
      {
        title: "Push the join below the union",
        md: "This is only legal because the fragmentation is derived: $\\text{TheolVorls}$ can match nothing but $\\text{TheolProfs}$. So $(\\bigcup_i A_i) \\bowtie (\\bigcup_i B_i)$ collapses to $\\bigcup_i (A_i \\bowtie B_i)$ instead of the full cross product of fragments.",
      },
      {
        title: "Push the projection down too",
        md: "Each node can apply $\\pi_{titel}$ to its own result, so only a list of titles ever crosses the network.",
      },
      {
        title: "Read the optimized plan",
        md: "$\\big(\\pi_{titel}(\\sigma \\bowtie)\\big)_{\\text{Theol}} \\cup \\big(\\pi_{titel}(\\sigma \\bowtie)\\big)_{\\text{Physik}} \\cup \\big(\\pi_{titel}(\\sigma \\bowtie)\\big)_{\\text{Philo}}$. The union has travelled from the bottom of the plan to the top — the whole point of the exercise. Each site computes a complete, independent sub-answer and only the small results are merged.",
      },
    ],
  },
  { kind: "concepts", ids: ["query-translation"] },
];

const replication: Block[] = [
  {
    kind: "prose",
    md: "Under replication every machine holds a consistent copy of the entire dataset. That improves query throughput, survives node failures, and solves the locality problem — at the price of keeping the copies in agreement on every write.\n\nThere are three classic ways to control that. **Read one, write all (ROWA)** — cheap reads, expensive writes that fail if any replica is down. A **single master with multiple replicas** — one writer, many readers. And **quorum consensus**, which makes the trade-off a dial rather than a switch.",
  },
  {
    kind: "prose",
    md: "Quorum consensus assigns each site a **weight**. Let $W$ be the total of all site weights, and choose a read quorum $Q_r$ and a write quorum $Q_w$ such that:",
  },
  {
    kind: "formula",
    tex: "Q_r + Q_w > W \\qquad \\text{and} \\qquad 2 \\cdot Q_w > W",
    caption: "Every read then overlaps the latest write, and two writes can never proceed at once.",
  },
  {
    kind: "prose",
    md: "Each read must lock enough replicas that their weights sum to at least $Q_r$; each write must lock enough to reach $Q_w$. Because the two quorums must overlap, any read is guaranteed to touch at least one site that took part in the most recent write — which is why replicas carry **version numbers**: the reader takes the value with the highest version among the sites it locked.",
  },
  {
    kind: "interactive",
    title: "Quorum consensus lab",
    description:
      "Four sites with the lecture's weights 3, 1, 2, 2. Set the quorums, lock sites by clicking them, and write and read. Break the rules and you can produce a stale read on purpose.",
    component: QuorumLab,
  },
  {
    kind: "table",
    headers: ["Site", "Copy", "Weight", "Value before", "Version", "Value after write", "Version"],
    rows: [
      ["S1", "A1", "3", "1000", "1", "1100", "2"],
      ["S2", "A2", "1", "1000", "1", "1000", "1"],
      ["S3", "A3", "2", "1000", "1", "1100", "2"],
      ["S4", "A4", "2", "1000", "1", "1000", "1"],
    ],
    caption:
      "W = 8, Qr = 4, Qw = 5. The write locked S1 and S3 (weight 5) and left S2 and S4 stale — but any read reaching weight 4 must include S1 or S3, so it still sees version 2.",
  },
  { kind: "concepts", ids: ["replication", "rowa", "quorum-consensus"] },
];

const twoPhaseCommit: Block[] = [
  {
    kind: "prose",
    md: "Just as in a non-distributed system, a transaction has to be atomic. It ends in one of two ways: **commit** — it succeeded and all constraints hold, so it must become persistent and visible on every node — or **abort** — it failed, so it must be undone on every node.\n\nThe problem is that the nodes of a distributed system crash independently. The solution is the **two-phase commit protocol (2PC)**: one node acts as coordinator and lets $n$ agents $A_1, \\dots, A_n$ either all persist the changes of a transaction or all discard them.",
  },
  {
    kind: "interactive",
    title: "Two-phase commit simulator",
    description:
      "Step through the protocol under four scenarios — including the one where the coordinator dies at the worst possible moment.",
    component: TwoPhaseCommitSimulator,
  },
  {
    kind: "table",
    headers: ["Coordinator state", "On", "Action — the log record is written first"],
    rows: [
      ["Initial → Collecting", "end of transaction", "send PREPARE to all agents"],
      ["Collecting → Committing", "READY from all agents", "write commit to the log, then send COMMIT"],
      ["Collecting → Aborted", "timeout or FAILED received", "write abort to the log, then send ABORT"],
      ["Committing / Aborted → Done", "ACK from all agents", "the transaction is finished"],
    ],
  },
  {
    kind: "table",
    headers: ["Agent state", "On", "Action"],
    rows: [
      ["Waiting → Prepared", "PREPARE received, locally fine", "force log records to disk, write ready, send READY"],
      ["Waiting → Aborted", "timeout or local error", "write abort to the log, send FAILED"],
      ["Prepared → Committed", "COMMIT received", "write commit to the log, send ACK"],
      ["Prepared → Aborted", "ABORT received", "write abort to the log, send ACK"],
    ],
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "2PC is a blocking protocol",
    md: "In state **Prepared** an agent has given up its right to decide: it may neither commit nor abort on its own. If the coordinator crashes after collecting the votes but before sending the decision, every prepared agent is blocked and keeps its locks until the coordinator recovers. The coordinator is a single point of failure.\n\nThe four crash cases: coordinator **before** commit — all agents block in Prepared. Coordinator **after** commit — recovery reads the log and resends the decision. Agent **before** ready — the coordinator times out and aborts globally. Agent **after** ready — the agent asks the coordinator for the outcome when it restarts.",
  },
  {
    kind: "prose",
    md: "Four refinements are worth knowing by name. **Linear 2PC** organises the agents as a chain $A_1 \\to \\cdots \\to A_n$, using $2(n-1)$ messages instead of $4n$ at the cost of latency. **Presumed abort** interprets a missing log entry as abort, saving log writes and ACK messages. **Three-phase commit** inserts a pre-commit phase that removes the blocking, at the price of another round trip — rarely used in practice. **Consensus protocols** such as Paxos and Raft replicate the coordinator itself, so its crash no longer blocks anyone; this is what modern systems actually do.",
  },
  { kind: "concepts", ids: ["two-phase-commit", "2pc-blocking", "2pc-variants"] },
];

const joins: Block[] = [
  {
    kind: "prose",
    md: "Joins in a replicated setting are easy — every node has everything, so a join is a local join. Joins get interesting when the data is **sharded**, because the two rows that need to meet may live on different machines. There are three ways to arrange that meeting.",
  },
  {
    kind: "interactive",
    title: "Join strategy explorer",
    description:
      "Co-located, distributed and broadcast joins, and exactly what each one puts on the wire.",
    component: JoinStrategyExplorer,
  },
  {
    kind: "table",
    headers: ["Medium", "Bandwidth", "Time to scan lineitem"],
    rows: [
      ["DRAM", "20 GB/s", "0.04 s"],
      ["FDR InfiniBand", "7 GB/s", "0.1 s"],
      ["PCIe SSD", "2 GB/s", "0.36 s"],
      ["SATA SSD", "500 MB/s", "1.6 s"],
      ["10 GB ethernet", "1.25 GB/s", "0.6 s"],
      ["rotating disk", "200 MB/s", "3.6 s"],
      ["1 GB ethernet", "125 MB/s", "6 s"],
    ],
    caption:
      "The reason distribution pays at all: over InfiniBand or 10 GB ethernet, reading a table from the RAM of remote machines beats reading it from a local SSD.",
  },
  {
    kind: "prose",
    md: "Whichever strategy you pick, the cheapest tuple to send is the one you do not send. A **semi-join filter** exploits that: ship only the join-column values, so only tuples that actually have a join partner ever travel.",
  },
  {
    kind: "formula",
    tex: "R \\bowtie S = R \\bowtie (\\pi_C(R) \\bowtie S) \\qquad R \\ltimes S = R \\bowtie \\pi_C(S)",
    caption:
      "Send π_C(R) to the site holding S, compute the reduced S there, send it back, and finish the join locally.",
  },
  {
    kind: "prose",
    md: "There are two ways to arrange this. The first filters one side: send $\\pi_C(S)$ to the site of $R$, reduce $R$, and ship the reduced $R$ over for the join. The second filters **both** sides at once — $(R \\bowtie \\pi_C(S)) \\bowtie (\\pi_C(R) \\bowtie S)$ — which is worth it when both relations are large and the join is selective.\n\nA **Bloom filter** takes the same idea one step further: instead of the join values themselves, ship a bit vector. Hash every join value of $R$ into $m$ bits with $k$ hash functions; the remote site keeps a tuple only if all of its bits are set. There are no false negatives, so no real match is ever lost. Collisions only let a few extra tuples through — classically called **false drops** — and the final join discards them anyway.",
  },
  {
    kind: "interactive",
    title: "Semi-join and Bloom filter lab",
    description:
      "The exact relations from the lecture. Compare shipping all of S against a semi-join and against a Bloom filter, and watch the false drops appear as you shrink the filter.",
    component: SemiJoinBloomLab,
  },
  { kind: "concepts", ids: ["join-types", "semi-join", "bloom-filter-join"] },
];

const systems: Block[] = [
  {
    kind: "prose",
    md: "What can vanilla **PostgreSQL** do? It supports read replicas, and since version 9.6 those replicas are kept in sync, which allows consistent reads and load-balanced read workloads. What it does **not** support is data distribution or distributed queries. For that you need a different system.",
  },
  {
    kind: "prose",
    md: "**Pivotal Greenplum** is a distributed, open-source database built on PostgreSQL. Its cluster has a **master** node that holds the schemas and **segment** nodes that hold the data, plus a standby master and secondary (mirror) segments for failover. It supports both data distribution and partitioning, and the two are specified separately when the table is created:\n\n- **DISTRIBUTED BY** — how rows are spread (sharded) across segments, by hash or randomly (round robin).\n- **PARTITION BY** — how data is partitioned **within** a segment, by list of values or by range (numeric or date), with subpartitioning.",
  },
  {
    kind: "code",
    lang: "sql",
    code: `-- hash distribution: rows are sharded across segments by prod_id
CREATE TABLE products
  (name varchar(40), prod_id integer, supplier_id integer)
DISTRIBUTED BY (prod_id);

-- round-robin distribution: even spread, but no locality on any column
CREATE TABLE random_stuff
  (things text, doodads text, etc text)
DISTRIBUTED RANDOMLY;`,
    caption: "Greenplum distribution: the sharding decision.",
  },
  {
    kind: "code",
    lang: "sql",
    code: `CREATE TABLE sales
  (trans_id int, date date, amount decimal(9,2), region text)
DISTRIBUTED BY (trans_id)
PARTITION BY RANGE (date)
  SUBPARTITION BY LIST (region)
    SUBPARTITION TEMPLATE
      ( SUBPARTITION usa    VALUES ('usa'),
        SUBPARTITION asia   VALUES ('asia'),
        SUBPARTITION europe VALUES ('europe'),
        DEFAULT SUBPARTITION other_regions )
  ( START (date '2008-01-01') INCLUSIVE
    END   (date '2009-01-01') EXCLUSIVE
    EVERY (INTERVAL '1 month'),
    DEFAULT PARTITION outlying_dates );`,
    caption:
      "The fragmentation example from the slides: sharded across segments by trans_id, then range-partitioned by month and list-subpartitioned by region inside each segment.",
  },
  {
    kind: "interactive",
    title: "Greenplum fragmentation explorer",
    description:
      "The sales table above. See which segment each row lands on, then open a segment to find the monthly partitions and regional subpartitions inside it.",
    component: GreenplumExplorer,
  },
  {
    kind: "prose",
    md: "**MemSQL** is another distributed database, compatible with MySQL. A cluster consists of **aggregator** nodes — which hold metadata, distribute queries, aggregate results, and handle cluster monitoring and failover — and **leaf** nodes, which are the storage layer and execute the SQL.\n\nData can be sharded across machines, and in addition tables can be replicated to all machines as **reference tables**, which makes broadcast joins local. Co-located and distributed joins are supported too. By default MemSQL shards a table by its primary key; a manual shard key can be given.",
  },
  {
    kind: "code",
    lang: "sql",
    code: `CREATE TABLE clicks (
  click_id BIGINT AUTO_INCREMENT,
  user_id  INT,
  page_id  INT,
  ts       TIMESTAMP,
  SHARD KEY (user_id),
  PRIMARY KEY (click_id, user_id)
);`,
    caption:
      "Sharding clicks by user_id rather than by the primary key, so that all of one user's clicks — and any join on user_id — stay on one leaf node.",
  },
  { kind: "concepts", ids: ["greenplum", "memsql"] },
];

const consistency: Block[] = [
  {
    kind: "prose",
    md: "Conjectured by Brewer in 2000 and proven by Gilbert and Lynch in 2002, the **CAP theorem** says a distributed data store can guarantee at most two of three properties.\n\n**Consistency**: every read returns the most recent write, as if there were a single copy. **Availability**: every request to a non-failing node receives a non-error answer. **Partition tolerance**: the system keeps working although messages between nodes are lost.",
  },
  {
    kind: "table",
    headers: ["Combination", "What it means", "Examples"],
    rows: [
      ["CA", "Consistent and available, but cannot survive a partition", "A single node; a classic 2PC cluster"],
      ["CP", "Consistent and partition tolerant, refuses service on the minority side", "HBase, Spanner, a quorum with Qr + Qw > W"],
      ["AP", "Available and partition tolerant, reconciles conflicts afterwards", "Dynamo, Cassandra, Riak"],
    ],
  },
  {
    kind: "info",
    variant: "note",
    title: "Two out of three is a simplification",
    md: "Partitions are not a design choice — in a real network they simply happen. So the theorem really says: **if** the network partitions, you must choose between consistency and availability. CP refuses requests on the minority side (2PC blocks, a quorum system rejects writes) and the data stays correct; AP accepts writes on both sides and reconciles later with vector clocks, last-writer-wins or CRDTs, making conflicts the application's problem. And the choice is made **per operation**, not once for the whole system.",
  },
  {
    kind: "prose",
    md: "**PACELC** is Abadi's refinement: *if there is a Partition, trade Availability against Consistency; Else trade Latency against Consistency.* It makes the second cost visible — even with nothing broken, every synchronous replica has to be waited for.",
  },
  {
    kind: "table",
    headers: ["System", "Under partition", "In normal operation"],
    rows: [
      ["Dynamo, Cassandra, Riak", "PA — stay available", "EL — favour latency"],
      ["MongoDB", "PA — stay available", "EC — favour consistency"],
      ["HBase, Spanner, VoltDB", "PC — stay consistent", "EC — favour consistency"],
      ["PostgreSQL (single node)", "— not applicable", "EC — favour consistency"],
    ],
  },
  {
    kind: "prose",
    md: "Between linearisable and eventual there is a ladder, and each rung allows more reordering and therefore more parallelism. **Linearisable**: reads see the latest committed write, and operations appear in real-time order. **Sequential**: all nodes see the same order, but not necessarily the real-time one. **Causal**: operations that depend on each other are seen in order, concurrent ones may differ. **Eventual**: if updates stop, all replicas eventually converge.",
  },
  {
    kind: "prose",
    md: "Eventual consistency alone is hard to program against, so systems offer **session guarantees** within one session: *read your writes* (a transaction sees its own updates), *monotonic reads* (a value once read is never replaced by an older one), *monotonic writes* (writes are applied in their issuing order) and *writes follow reads* (a write based on a read is ordered after it). These are implemented by pinning a session to a replica, or by carrying version vectors in the client.",
  },
  {
    kind: "info",
    variant: "insight",
    title: "The quorum protocol is the CAP dial",
    md: "$Q_r + Q_w > W$ and $2 Q_w > W$ give strong consistency — a CP system. $Q_r + Q_w \\le W$ lets reads miss the latest write, which is eventual consistency and an AP system; this is exactly Dynamo's N/R/W configuration. $Q_w = W$ with $Q_r = 1$ is read one, write all: fast reads, expensive and fragile writes. $Q_w = 1$ gives fast writes, but readers have to inspect every replica.",
  },
  { kind: "concepts", ids: ["cap", "pacelc", "consistency-models"] },
];

const mistakes: Block[] = [
  {
    kind: "info",
    variant: "pitfall",
    title: "Mixing up which operator reconstructs which fragmentation",
    md: "Horizontal is **selection then union**; vertical is **projection then join**. The quickest way to recover it under pressure: horizontal cuts rows, and you glue rows back with $\\cup$; vertical cuts columns, and you glue columns back with $\\bowtie$.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Forgetting the key in a vertical fragmentation",
    md: "An arbitrary vertical split is **not** reconstructable. Either repeat the primary key in every fragment — accepting that disjointness is lost — or give every tuple a surrogate tuple-id. A vertical fragmentation without a shared candidate key has simply destroyed data.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Forgetting the negative fragment",
    md: "With predicates for theology, physics and philosophy you get four fragments, not three. The one for professors in none of those faculties is easy to omit and breaks completeness.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Checking only one quorum condition",
    md: "$Q_r + Q_w > W$ alone is not enough; $2 Q_w > W$ is a separate requirement. With $W = 8$, the pair $Q_r = 5, Q_w = 4$ satisfies the first ($9 > 8$) but fails the second ($8 \\not> 8$), so two writes could proceed concurrently.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Thinking a Bloom filter can lose a join result",
    md: "It cannot. A Bloom filter has no false negatives, so every genuine match passes and the join result is **exact**. Only extra tuples — false drops — get shipped, and the real join removes them. What you trade is bandwidth, not correctness.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Claiming 2PC blocks whenever a node crashes",
    md: "An agent crashing is survivable: if it never sent READY, the coordinator times out and aborts globally. Blocking happens specifically when agents are in **Prepared** and the **coordinator** is the thing that died before broadcasting its decision.",
  },
];

const quiz: Block[] = [
  {
    kind: "prose",
    md: "Twelve questions across the whole lecture: fragmentation and its correctness criteria, derived fragmentation, transparency, quorums, 2PC, join strategies and Greenplum. The arithmetic ones are worth doing on paper first.",
  },
];

const summary: Block[] = [
  { kind: "list", variant: "takeaways", items: lecture02Meta.takeaways },
  {
    kind: "table",
    headers: ["Idea", "Rule or formula", "Where it shows up"],
    rows: [
      ["Horizontal fragmentation", "σ to fragment, ∪ to reconstruct", "Sharding"],
      ["Vertical fragmentation", "π to fragment, ⋈ on the key to reconstruct", "Splitting wide tables"],
      ["Decomposition predicates", "n predicates → 2ⁿ fragments", "Completeness and disjointness by construction"],
      ["Correctness", "completeness + reconstructability (+ optional disjointness)", "Every fragmentation question"],
      ["Derived fragmentation", "Vorls ⋉ Profs, per fragment", "Turning a complete join graph into local joins"],
      ["Transparency", "fragmentation, replication, location", "What the user is allowed not to know"],
      ["Quorum consensus", "Qr + Qw > W and 2·Qw > W", "Tunable consistency"],
      ["ROWA", "Qw = W, Qr = 1", "The cheap-read extreme of quorums"],
      ["2PC phase 1", "PREPARE → READY / FAILED", "Collecting votes"],
      ["2PC phase 2", "COMMIT / ABORT → ACK", "Broadcasting one decision"],
      ["2PC blocking", "Prepared agents + dead coordinator", "Why 3PC, Paxos and Raft exist"],
      ["Semi-join", "R ⋈ S = R ⋈ (π_C(R) ⋈ S)", "Shipping only tuples with a partner"],
      ["Bloom filter join", "m bits, k hashes, false drops only", "Shipping bits instead of values"],
      ["Greenplum", "DISTRIBUTED BY across segments, PARTITION BY within one", "The fragmentation example"],
      ["MemSQL", "aggregator + leaf, SHARD KEY, reference tables", "Broadcast joins made local"],
      ["CAP / PACELC", "P → A vs C, Else L vs C", "Placing a system on the map"],
    ],
    caption: "Everything from this lecture that is worth carrying into an exam.",
  },
  {
    kind: "info",
    variant: "insight",
    title: "The one sentence version",
    md: "Cut the relation so that the queries you care about stay local, replicate it so that failures and reads are cheap, use a quorum and two-phase commit to keep the copies honest, and when rows still have to meet across machines, send the smallest thing that identifies them — a projection, or just some bits.",
  },
];

export const lecture02Blocks: SectionBlocks<typeof lecture02Outline> = {
  objectives,
  "why-clusters": whyClusters,
  fragmentation,
  reconstruction,
  derived,
  sharding,
  optimization,
  replication,
  "two-phase-commit": twoPhaseCommit,
  joins,
  systems,
  consistency,
  mistakes,
  quiz,
  summary,
};
