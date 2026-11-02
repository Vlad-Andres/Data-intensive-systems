import type { LectureMeta, SectionOutline } from "@/content/types";

export const lecture11Outline = [
  { id: "objectives", title: "Learning objectives", kind: "objectives" },
  { id: "why-graphs", title: "Why graphs", kind: "intuition" },
  { id: "property-graph", title: "The property graph model", kind: "concepts" },
  { id: "rdf", title: "RDF: graphs as triples", kind: "concepts" },
  { id: "relational-storage", title: "Storing graphs in relational tables", kind: "playground" },
  { id: "cypher", title: "Neo4j and Cypher", kind: "examples" },
  { id: "gremlin-rest", title: "Gremlin, REST and indexes", kind: "examples" },
  { id: "internals", title: "Inside Neo4j: native processing and storage", kind: "concepts" },
  { id: "dependability", title: "Transactions, availability and scale", kind: "concepts" },
  { id: "mistakes", title: "Common mistakes", kind: "mistakes" },
  { id: "quiz", title: "Check your understanding", kind: "quiz" },
  { id: "summary", title: "Cheat sheet", kind: "summary" },
] as const satisfies readonly SectionOutline[];

export const lecture11Meta: LectureMeta = {
  slug: "graph-databases",
  number: 11,
  title: "Graph Data Management",
  subtitle: "Property graphs, RDF in relational tables, Neo4j and how a native graph database works",
  summary:
    "Some data is mostly about connections: social networks, citations, transport and communication networks. This lecture covers the property graph model and RDF, the ways to store graph data with relational technology (vertical tables, property tables, vertical partitioning, smart indexing), Neo4j with its Cypher and Gremlin query languages, and what happens inside a native graph database — index-free adjacency, fixed-size record stores, transactions, high availability and scale.",
  topics: ["Property graph", "RDF", "Vertical table", "Property table", "Vertical partitioning", "Hexastore", "Neo4j", "Cypher", "Gremlin", "Index-free adjacency"],
  difficulty: "core",
  estimatedMinutes: 80,
  sources: [
    { label: "NoSQL: Graph Data Management", kind: "slides", detail: "Yannis Velegrakis" },
    { label: "Relational Technologies, Metadata and RDF", kind: "chapter", detail: "Yannis Velegrakis — Section 1.4–1.5: RDF and relational RDF storage" },
    { label: "Seven Databases in Seven Weeks, Chapter 6: Neo4j", kind: "chapter", detail: "Redmond, Wilson et al. — Cypher, REST, indexes, high availability" },
    { label: "Graph Databases, Chapter 6: Graph Database Internals", kind: "chapter", detail: "Robinson, Webber, Eifrem — native processing and storage, APIs, nonfunctional characteristics" },
  ],
  objectives: [
    "Explain why graphs suit heterogeneous, connected data, and tell graph databases from graph analytics.",
    "Describe the property graph model: nodes, labels, typed and directed relationships, properties.",
    "Describe RDF triples and RDF Schema, and why URIs are mapped to numeric identifiers.",
    "Compare the relational storage schemes for RDF — vertical table, graph schema, property table, vertical partitioning, smart indexing — and the queries each is good or bad at.",
    "Read and write basic Cypher: MATCH, WHERE, RETURN, CREATE, SET, DELETE, variable-length paths and shortestPath.",
    "Read basic Gremlin traversals and explain Neo4j's REST interface and indexes.",
    "Explain index-free adjacency and how Neo4j stores nodes, relationships and properties in fixed-size records.",
    "Explain Neo4j's transactions, recovery, master-slave high availability, scaling dimensions, and its place in CAP.",
  ],
  takeaways: [
    "Graphs capture heterogeneous data with no fixed schema and show how the parts connect — hard to model with relational joins.",
    "Property graph: nodes with labels, directed relationships with a type, and name–value properties on both.",
    "RDF stores everything as (subject, predicate, object) triples of URIs and literals; RDFS adds classes, sub-classes, sub-properties, domains and ranges.",
    "Vertical table: one triple table, great for heterogeneous data and single-triple queries, but path and multi-property queries need many self-joins.",
    "Property tables remove joins for common single-valued properties (rest in an excess table); vertical partitioning keeps one two-column table per predicate; hexastores index all six orders of s, p, o.",
    "Cypher is declarative pattern matching: MATCH (a)-[:TYPE]->(b) WHERE … RETURN …; Gremlin is a step-by-step traversal (pipes) language.",
    "Index-free adjacency: each node points directly to its relationships, so a hop costs O(1) instead of an O(log n) index lookup — traversals cost O(m), not O(m log n).",
    "Neo4j is ACID with a write-ahead log; HA is master-slave with full-graph replicas and eventual consistency across slaves (AP); graphs cannot be auto-sharded.",
  ],
  outline: lecture11Outline,
};
