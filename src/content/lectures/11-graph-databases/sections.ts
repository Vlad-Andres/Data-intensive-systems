import type { Block, SectionBlocks } from "@/content/types";
import { lecture11Meta, lecture11Outline } from "./meta";
import { RdfStorageLab } from "./interactive/RdfStorageLab";

const objectives: Block[] = [
  {
    kind: "prose",
    md: "The second NoSQL lecture is about data whose value lies in its **connections**. It covers the property graph model, **RDF** and how to store it with relational technology, **Neo4j** with its query languages Cypher and Gremlin, and how a native graph database works inside. For more Cypher than this page covers, the official Cypher manual is the reference.",
  },
  { kind: "list", variant: "objectives", items: lecture11Meta.objectives },
];

const whyGraphs: Block[] = [
  {
    kind: "prose",
    md: "**Humans think in graphs**: we understand new things by matching them to things we know, and what we know is connected. Graphs also capture **naturally heterogeneous data**: there is no specific schema, they show how the different parts connect, they are hard to model with relational joins, and the connections are often what gives the most informative insights.\n\nGraph data is everywhere:",
  },
  {
    kind: "table",
    headers: ["Kind of network", "Example"],
    rows: [
      ["Social networks", "The Facebook social graph — four degrees of separation (Backstrom et al., 2011)"],
      ["Media networks", "Links between political blogs, showing a polarised network (Adamic and Glance, 2005)"],
      ["Information networks", "Citation networks and maps of science (Börner et al., 2012)"],
      ["Transportation networks", "Bus and rail lines between stops"],
      ["Communication networks", "The Internet: routers grouped in domains"],
    ],
  },
  {
    kind: "info",
    variant: "note",
    title: "The first ever graph",
    md: "Euler's **Seven Bridges of Königsberg** (1735): can you return to your starting point after crossing every bridge exactly once? Modelling the land masses as nodes and the bridges as edges turned the city into a graph — and showed it is impossible, because every land mass touches an odd number of bridges.",
  },
  {
    kind: "figure",
    src: "graph/konigsberg.png",
    alt: "Map of Königsberg with its seven bridges highlighted, and the graph Euler drew from it: four land masses as nodes, seven bridges as edges.",
    width: 960,
    height: 700,
    caption: "The Seven Bridges of Königsberg (Euler, 1735): cross every bridge exactly once and return to the start.",
  },
  {
    kind: "prose",
    md: "Keep two things apart. A **graph database** such as Neo4j is for **storage**, the same way a relational database stores tuples. **Graph analytics** — k-core, centrality and so on — is for **processing** graph data, much as clustering or frequent itemsets are for ordinary data analysis. This lecture is about the first.",
  },
  { kind: "concepts", ids: ["graph-db-vs-analytics"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Why do graphs suit heterogeneous data?", answer: "No fixed schema, they show how parts connect, and those connections are hard to express with relational joins." },
      { prompt: "Graph database versus graph analytics?", answer: "A graph database stores graphs (like an RDBMS stores tuples); graph analytics processes them (k-core, centrality)." },
    ],
  },
];

const propertyGraph: Block[] = [
  {
    kind: "prose",
    md: "**The property graph model** has three ingredients:\n\n- **Nodes** represent objects and can carry **labels**.\n- **Relationships** relate two nodes, have a label used as a **type**, and have a **direction**.\n- **Properties** are name–value pairs that describe characteristics, on nodes *or* on relationships.",
  },
  {
    kind: "figure",
    src: "graph/property-graph.png",
    alt: "Property graph: Jo (name, age 26) marriedTo Mary (age 28) with property in: 2005; Jo livesIn The Mill (in New York, built in 2007).",
    width: 790,
    height: 650,
    caption: "A small property graph: nodes A, B and C with properties, and two typed, directed relationships.",
  },
  {
    kind: "table",
    headers: ["Element", "In the example"],
    rows: [
      ["Node A", "name: Jo, age: 26"],
      ["Node B", "name: Mary, age: 28"],
      ["Node C", "name: The Mill, in: New York, builtIn: 2007"],
      ["Relationship A → B", "type marriedTo, property in: 2005"],
      ["Relationship A → C", "type livesIn"],
    ],
  },
  {
    kind: "prose",
    md: "Neo4j is called **whiteboard friendly**: virtually any diagram of boxes and lines on a whiteboard can be stored as it is. Compare a wine-suggestion app modelled relationally — tables categories, wines, articles and the join tables wines_categories and wines_articles — with the whiteboard version: *Prancing Wolf* –produced→ *2007* –grape_type→ *Riesling*, and *Wine Expert* –reported_on→ *2007*. As the saying goes, on a long enough timeline all fields become optional; a graph provides **values and structure only where necessary**, so there is no schema to adjust when a wine turns out to have no vintage.\n\nIn Neo4j a label is **not a type**: two nodes labeled Wine can have completely different properties, and types must be enforced by the application if needed.",
  },
  {
    kind: "figure",
    src: "graph/relational-wine-schema.jpg",
    alt: "Relational schema for a wine app: tables categories, wines, articles and join tables wines_categories and wines_articles.",
    width: 1424,
    height: 504,
    caption: "The wine app as relational tables and join tables…",
  },
  {
    kind: "figure",
    src: "graph/wine-whiteboard.jpg",
    alt: "Hand-drawn graph: Prancing Wolf produced 2007, Wine Expert reported on 2007, 2007 has grape type Riesling.",
    width: 974,
    height: 542,
    caption: "…and the same data as drawn on a whiteboard, which is exactly how it is stored in a graph.",
  },
  { kind: "concepts", ids: ["property-graph"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Name the three parts of the property graph model.", answer: "Nodes (with labels), relationships (with a type and a direction) and properties (name–value pairs on nodes and relationships)." },
      { prompt: "What does 'whiteboard friendly' mean?", answer: "Whatever you draw as boxes and lines can be stored directly as nodes and relationships, adding values and structure only where needed." },
    ],
  },
];

const rdf: Block[] = [
  {
    kind: "prose",
    md: "**RDF** — the *Resource Description Framework* — was introduced to describe metadata on the web. Everything is a **resource** identified by a **URI**. Information is a set of **statements**, each a triple **(subject, predicate, object)**: the subject is a URI, the predicate names the relationship, and the object is another URI or a literal. For example, (http://www.w3.org/RDF, owner, http://www.w3.org) says W3C owns that page.\n\nDraw each statement as an edge from subject to object labeled with the predicate, and RDF data becomes a **graph**. Statements are resources too, so a statement can be the subject of another one — an edge can point to an edge, making it a **hyper-graph**. A set of triples is an **RDF base**.",
  },
  {
    kind: "prose",
    md: "**RDF Schema** (RDFS) adds typing on top:\n\n- **rdfs:Class** groups resources with a common structure; rdf:type links a resource to its classes, and every resource is an instance of rdf:Thing.\n- **rdfs:subClassOf** orders classes (instances of a sub-class are instances of the super-class) and **rdfs:subPropertyOf** orders properties.\n- **rdfs:domain** and **rdfs:range** restrict which classes a property may connect.\n\nRDF also has an **XML syntax**. Take a couple — *Couple* with husband *John* (full name John Smith) and wife *Mary* (Mary Wilkinson) — shown below as an RDF graph (top) and as the tree of its XML syntax (bottom). It shows the problem with storing RDF as XML: the XML tree adds rdf:RDF, Description, rdf:about and rdf:resource nodes that are not part of the RDF graph, and XML queries follow root-to-element paths while RDF queries traverse a graph.",
  },
  {
    kind: "figure",
    src: "graph/rdf-couple.jpg",
    alt: "Top: RDF graph Couple with John (John Smith) and Mary (Mary Wilkinson). Bottom: XML tree with rdf:RDF, Description, mns:husband, rdf:resource and rdf:about nodes.",
    width: 1552,
    height: 852,
    caption: "The same RDF data as a graph (top) and as the tree of its XML syntax (bottom): the XML tree has many extra nodes.",
  },
  {
    kind: "info",
    variant: "insight",
    title: "First step of any relational RDF store: shorten the URIs",
    md: "Long URIs are fine to store but bad to index: many indexes use at most **256 or 512 characters** of a key, and truncated URIs stop being unique. Stores therefore keep URIs **reversed** (truncation hits the common prefix), or map them to **numeric identifiers** — numbers also compare much faster than strings. 3Store uses **hash keys** for every URI and literal. Below, URIs and their identifiers are treated as the same thing.",
  },
  { kind: "concepts", ids: ["rdf"] },
  {
    kind: "recall",
    cards: [
      { prompt: "What is an RDF statement?", answer: "A triple (subject, predicate, object); subject and predicate are URIs, the object a URI or a literal." },
      { prompt: "Why is RDF data a hyper-graph?", answer: "Statements are resources themselves, so an edge (statement) can be connected by another edge." },
      { prompt: "Name four RDFS constructs.", answer: "rdfs:Class, rdfs:subClassOf, rdfs:subPropertyOf, rdfs:domain and rdfs:range (also rdf:type)." },
      { prompt: "Two drawbacks of storing RDF as XML?", answer: "The XML tree contains nodes that are not in the RDF graph, and XML queries are tree paths while RDF queries are graph traversals." },
    ],
  },
];

const relationalStorage: Block[] = [
  {
    kind: "prose",
    md: "**How do we store graph data using relational technologies?** Building an RDF store from scratch costs effort, time and money, while relational systems have three decades of maturity, good query performance and scalability. Most RDF stores (Jena, Oracle, Sesame, 3Store, Hexastore…) therefore put a **layer** on top of a relational database that knows the storage scheme and translates RDF queries (SPARQL) into SQL. The schemes below all store the same four publications.",
  },
  {
    kind: "table",
    headers: ["Scheme", "Layout", "Good at", "Bad at"],
    rows: [
      ["Vertical table", "One table Statements(subject, predicate, object)", "Highly heterogeneous data; single-triple queries with indexes", "Many self-joins for browsing, paths and multi-property queries"],
      ["Graph-based storage", "Tables per subgraph (class, property, type…), with materialised root paths in a Path table", "Path expressions without joins", "Precomputing paths; requires acyclic data"],
      ["Graph schema, vertical data", "Schema tables Class, Property, SubClass, SubProperty; data tables Instance and PropertyInstance (or one table per class and per property)", "Using RDF Schema information, B+ tree indexes on every attribute", "One table per class can mean more than 300,000 tables"],
      ["Property table", "Common single-valued properties as columns; the rest in an excess table", "Queries on clustered properties need no joins", "Multi-valued and rare properties go to the excess table; NULLs; combining class tables needs unions"],
      ["Vertical partitioning", "One two-column table (URI, value) per predicate", "Reading only the needed properties; merge-joins on sorted URIs; multi-valued properties", "Many joins for multi-property queries; property names only in table names"],
      ["Smart indexing", "Six list-of-lists indexes, one per order of s, p, o", "Exploratory queries; multi-valued properties; no NULLs", "Space: every value indexed twice"],
    ],
    caption: "Relational storage schemes for RDF (Velegrakis, Section 1.5).",
  },
  {
    kind: "prose",
    md: "**Vertical table.** The straightforward scheme: each tuple is one triple. *Does Calvanese have publications?* becomes the selection SELECT subject FROM Statements WHERE predicate = 'author' AND object = 'Calvanese' — fast with indexes. *In which journals did Mecca and Atzeni publish together?* needs **three copies** of Statements joined on subject. Schema triples live in the same table, so a *direct* sub-class is easy to find but sub-class in general means combining many triples.\n\n**Graph schema – vertical data** (RDFSuite) exploits RDF Schema: tables Class, Property (with domain and range), SubClass and SubProperty, a hard-coded Type table for built-ins, and data tables **Instance**(URI, classid) and **PropertyInstance**(from, name, to). In the example below, a Truck (100) and a Car (200) with brand, privateLicence and businessLicence. A variant uses one table per class and per property (brand, privateLicence, businessLicence…).\n\n**Property table.** Cluster properties that most resources share — type, title and year — into the columns of one table; resource 4 gets NULL for year. Everything else goes into an **excess table** with the vertical layout. *The article titled LAURIN from 2001* is then a single selection. **Multi-valued** properties (author) cannot be columns in first normal form and always land in the excess table. Variants: several property tables (journal and file always appear together), or **class property tables**, one per RDFS class (Article, Book) — where a shared property such as title appears in several tables and *all years* becomes a UNION.\n\n**Vertical partitioning** is the column-store idea: one table per predicate, k tables for k properties. URIs are keys only for single-valued properties, so indexes on the URI columns are needed; sorted by URI, tables merge-join efficiently and the values of a multi-valued property sit together.\n\n**Smart indexing** targets exploratory queries on heterogeneous data. A triple's three parts can be combined in 3! = **6 orders**; for each order (say subject–predicate–object) build a list of subjects, each pointing to a list of its predicates, each pointing to the list of objects — see the diagram below. The object lists of s-p-o and p-s-o are the same, so they are stored once. In relational form this needs two-column tables for the first two levels and single-column tables for the last. **RDF-3X** builds the same six indexes from scratch, compresses them and adds aggregate indexes.",
  },
  {
    kind: "figure",
    src: "graph/graph-schema-vertical-data.png",
    alt: "Tables Class, Property, Subclass, Subproperty, Instance, PropertyInstance and Type with URIs for Vehicle, Truck, Car, licences and the brands MAN and VW.",
    width: 1208,
    height: 1046,
    caption: "Graph schema – vertical data: schema tables (top), data tables (bottom).",
  },
  {
    kind: "figure",
    src: "graph/smart-indexing.png",
    alt: "A list of subjects s1…sq; s1 points to its predicates p1…pk; each predicate points to a vertical list of objects.",
    width: 1148,
    height: 794,
    caption: "One of the six smart-indexing structures: subject → predicates → objects.",
  },
  {
    kind: "interactive",
    title: "Storage schemes compared",
    description: "The four publications of the chapter stored three ways. Pick a scheme and a query: see the SQL, how many tables it reads and how many joins it needs.",
    component: RdfStorageLab,
  },
  {
    kind: "info",
    variant: "note",
    title: "A typo in the chapter's SQL",
    md: "In the chapter's query for Mecca and Atzeni, the second condition reads s1.object = 'Atzeni'. It must be **s2.object = 'Atzeni'** — otherwise s1.object would have to equal both names. The lab shows the corrected query.",
  },
  { kind: "concepts", ids: ["vertical-table", "property-table", "vertical-partitioning", "smart-indexing"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Why does the vertical table need many self-joins?", answer: "Every property of a resource is a separate row, so combining properties means joining Statements with itself on subject." },
      { prompt: "What goes into the excess table?", answer: "Multi-valued properties and properties that too few resources have (to avoid NULL-filled columns)." },
      { prompt: "Main weakness of vertical partitioning?", answer: "Multi-property queries need joins, and since property names are table names, 'all properties of a resource' must query every table." },
      { prompt: "Why six indexes in a hexastore?", answer: "One per order of subject, predicate and object (3! = 6)." },
    ],
  },
  {
    kind: "practice",
    id: "l11-storage",
    tasks: [
      {
        id: "excess",
        prompt: "In the property table for the four publications (columns type, title, year), how many rows does the excess table get?",
        check: { mode: "text", accept: ["16"], placeholder: "rows" },
        solution: "There are 27 triples. The property table holds 4 types, 4 titles and 3 years = 11 of them, so the excess table gets **16** rows: author 10, journal 2, file 2, publisher 2.",
      },
      {
        id: "partition-count",
        prompt: "How many tables does vertical partitioning create for the four publications?",
        check: { mode: "text", accept: ["7"], placeholder: "tables" },
        solution: "One per predicate: type, title, author, journal, year, file and publisher — **7** tables.",
      },
    ],
  },
];

const cypher: Block[] = [
  {
    kind: "prose",
    md: "**Neo4j** is whiteboard friendly, focuses on the **relationships between values** rather than on what sets of values have in common, and scales from being embedded in an application to clusters with master-slave replication that store tens of billions of nodes and as many relationships. It ships with a web browser console (start the server with bin/neo4j start, then open the browser page on port 7474) and can be used from Java, REST, **Cypher** and **Gremlin**; Cypher is now considered the standard.\n\n**Cypher** is a **declarative**, **expressive**, **pattern-matching** language. Nodes are written in parentheses, relationships as arrows:",
  },
  {
    kind: "code",
    lang: "cypher",
    code: `MATCH (n) RETURN n;                                // all nodes
MATCH (n:Person) RETURN n;                         // nodes with label Person
MATCH (p:Person {name: "Tom Hanks"}) RETURN p;     // inline property, exact match only
MATCH (p:Person) WHERE p.name = "Tom Hanks" RETURN p;
MATCH (m:Movie) WHERE m.released > 1990 AND m.released < 2000 RETURN m;

// movies Tom Hanks acted in, and directed (latest first)
MATCH (:Person {name:"Tom Hanks"})-[:ACTED_IN]->(m:Movie) RETURN m.title;
MATCH (:Person {name:"Tom Hanks"})-[:DIRECTED]->(m:Movie)
RETURN m.title, m.released ORDER BY m.released DESC;

// co-actors: any outgoing relationship to a movie, then ACTED_IN coming back in
MATCH (:Person {name:"Tom Hanks"})-->(:Movie)<-[:ACTED_IN]-(x:Person) RETURN x.name;`,
    caption: "Reading with MATCH, WHERE and RETURN on the Neo4j movie graph.",
  },
  {
    kind: "code",
    lang: "cypher",
    code: `CREATE (p:Person {name:"Tom Hanks"});
MATCH (p:Person {name:"Tom Hanks"}), (m:Movie {title:"Apollo 13"})
CREATE (p)-[:ACTED_IN]->(m);
CREATE (:Person {name:"Tom Hanks"})-[:ACTED_IN]->(:Movie {title:"Apollo 13"});  // whole pattern

MATCH ()-[r]-() WHERE id(r) = 0 SET r.rating = 97 RETURN r;   // property on a relationship
MATCH ()-[r:short_lived_relationship]-() DELETE r;             // delete relationships first,
MATCH (e:EphemeralNode) DELETE e;                              // then the node`,
    caption: "Writing: CREATE, SET and DELETE. A node with relationships cannot be deleted.",
  },
  {
    kind: "prose",
    md: "**Paths.** Friends of friends of Patty: MATCH (fof:Person)-[:friends]-(f:Person)-[:friends]-(p:Person {name: \"Patty\"}) RETURN fof.name. Leaving out the arrow head matches both directions. **Variable-length** patterns use a star: -[:ACTS_IN*1..4]- matches one to four ACTS_IN relationships. Each hop counts, so actors two degrees from Kevin Bacon are four hops away (actor–movie–actor–movie–actor). **shortestPath((a)-[:ACTS_IN*]-(b))** finds the shortest connection. Use **DISTINCT**: without it the same actor can be counted once per path (313 instead of 304 in the book's movie data).\n\n**Indexes and constraints** give a schemaless graph some structure: CREATE INDEX ON :Wine(name) speeds up lookups without changing queries; CREATE CONSTRAINT ON (w:Wine) ASSERT w.name IS UNIQUE rejects duplicates, checks existing data, and creates an index automatically.",
  },
  { kind: "concepts", ids: ["cypher"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Skeleton of a Cypher read query?", answer: "MATCH a pattern, WHERE conditions, RETURN results." },
      { prompt: "Why can't you delete a node straight away?", answer: "A node that still has relationships cannot be deleted; delete its relationships first (or match and delete both)." },
      { prompt: "What does -[:ACTS_IN*1..4]- mean?", answer: "A path of one to four ACTS_IN relationships, in either direction." },
      { prompt: "Index versus constraint in Neo4j?", answer: "An index speeds up lookups by label and property; a constraint (e.g. unique name) rejects bad writes and creates an index automatically." },
    ],
  },
  {
    kind: "practice",
    id: "l11-cypher",
    tasks: [
      {
        id: "directed-2000s",
        prompt: "Write a Cypher query returning the titles of movies released after 2000 that Tom Hanks directed.",
        check: { mode: "open" },
        solution: "```cypher\nMATCH (:Person {name:\"Tom Hanks\"})-[:DIRECTED]->(m:Movie)\nWHERE m.released > 2000\nRETURN m.title;\n```",
      },
      {
        id: "hops",
        prompt: "How many ACTS_IN hops separate two actors who are three degrees apart (three movies in between)?",
        check: { mode: "text", accept: ["6"], placeholder: "hops" },
        solution: "Each degree is actor → movie → actor, two hops: **6**. So use -[:ACTS_IN*1..6]- to reach everyone within three degrees.",
      },
    ],
  },
];

const gremlinRest: Block[] = [
  {
    kind: "prose",
    md: "**Gremlin** is a graph **traversal** language built on a Java project called **Pipes**: a query is a pipeline of steps over **g**, the variable that represents the graph, and it always returns a **set**. The examples use a small wine graph: *Wine Expert Monthly* (1) –reported_on→ *Prancing Wolf Ice Wine 2007* (0) –grape_type→ *riesling* (2).",
  },
  {
    kind: "figure",
    src: "graph/gremlin-wine-graph.jpg",
    alt: "Wine graph: Wine Expert Monthly reported_on Prancing Wolf Ice Wine 2007; three Prancing Wolf wines have grape_type riesling and are produced by Prancing Wolf Winery.",
    width: 1306,
    height: 334,
    caption: "The wine graph after adding the winery and two more wines.",
  },
  {
    kind: "code",
    lang: "groovy",
    code: `gremlin> g.V()                    // all vertices: v[0], v[1], v[2]
gremlin> g.E()                    // all edges: e[0][1-reported_on->0], e[1][0-grape_type->2]
gremlin> g.v(0).map()             // properties: name=Prancing Wolf Ice Wine 2007
gremlin> g.V.filter{it.name=='riesling'}                          // v[2]
gremlin> g.V.filter{it.name=='Wine Expert Monthly'}.outE          // e[0][1-reported_on->0]
gremlin> g.V.filter{it.name=='Wine Expert Monthly'}.outE.inV.name // Prancing Wolf Ice Wine 2007
gremlin> g.V.filter{it.name=='Wine Expert Monthly'}.out.name      // out = outE.inV

gremlin> pwolf = g.addVertex([name : 'Prancing Wolf Winery'])     // v[3]
gremlin> g.addEdge(pwolf, g.v(0), 'produced')                     // e[2][3-produced->0]

// wines sharing a grape type with the ice wine, without the ice wine itself
ice_wine = g.v(0)
ice_wine.out('grape_type').in('grape_type').filter{ !it.equals(ice_wine) }

alice.bothE('friends').bothV.name   // both directions: Alice, Patty`,
    caption: "Gremlin steps: outE, inE, inV, outV, out, in, both, bothE, bothV, filter; next() takes one element of a pipeline.",
  },
  {
    kind: "figure",
    src: "graph/gremlin-friends-graph.png",
    alt: "Patty is friends with Tom and Alice; Tom likes the Kabinett and the ice wine and trusts Wine Expert Monthly; Alice likes the ice wine.",
    width: 1230,
    height: 440,
    caption: "The social part of the wine graph used by the bothE example.",
  },
  {
    kind: "prose",
    md: "The last pipe — out along grape_type, back in along grape_type, then filter out the ice wine itself — replaces a nested Java loop over the wine's grape_type relationships: the same traversal written imperatively. Gremlin operations fall into six groups: into **load** (g.loadGraphSON), **create** (addVertex, addEdge, setProperty), **read** (g.V.count(), g.E.label.dedup(), g.V.has(name, value)), **update**, **delete** (removeVertex, removeEdge, removeProperty) and **traversal** (v.in(), v.out(), v.both('l'), degree filters, breadth-first loops and shortest paths). Several actions can be grouped into one transaction by switching the graph's transaction mode to manual (setTransactionMode with Mode.MANUAL).\n\n**REST.** Neo4j also exposes a REST interface on port 7474 under the path /db/data/, returning JSON with the URLs for nodes, relationships, indexes, Cypher and transactions — language-agnostic access from machines without Java. A POST to /db/data/node creates a node; /node/{id}/relationships creates a relationship; /node/{id}/paths finds a path with an algorithm such as shortestPath, allPaths, allSimplePaths or dijkstra. Everything is an object with its own URL, such as relationship 0.\n\n**Indexes** in the REST API are a separate service: a key-value (hash) index maps a key to a node URL, and a **Lucene**-based full-text index answers queries like name:P*. Cypher queries can also be sent over REST, to the cypher endpoint.",
  },
  { kind: "concepts", ids: ["gremlin"] },
  {
    kind: "recall",
    cards: [
      { prompt: "What is out() short for in Gremlin?", answer: "outE.inV: follow the outgoing edges to the vertices they point to." },
      { prompt: "What is Gremlin built on?", answer: "The Java Pipes project: a query is a pipeline of traversal steps over the graph g." },
      { prompt: "What does Neo4j use for full-text indexes?", answer: "Lucene." },
    ],
  },
];

const internals: Block[] = [
  {
    kind: "prose",
    md: "**Native graph processing.** A graph database processes graphs natively if it has **index-free adjacency**: every node keeps direct references to its adjacent nodes and acts as a **micro-index** of its neighbourhood. A non-native engine links nodes through **global indexes**. Finding Alice's friends then costs an O(log n) index lookup, and finding *who is friends with Alice* — the opposite direction — needs one lookup per candidate, or a reverse index for every traversal direction. With index-free adjacency, relationships are physically stored, both directions are equally cheap, and bidirectional joins are effectively **precomputed**.",
  },
  {
    kind: "figure",
    src: "graph/index-lookup.png",
    alt: "Non-native processing: a global index of (person, friend) pairs points to the nodes Alice, Bob, Charlie and Davina.",
    width: 1478,
    height: 1152,
    caption: "Non-native processing: every hop goes through a global index.",
  },
  {
    kind: "figure",
    src: "graph/friend-relationships.jpg",
    alt: "Native processing: Alice, Bob, Charlie and Davina connected directly by FRIEND relationships in both directions.",
    width: 1440,
    height: 482,
    caption: "Native processing: relationships are stored, so a hop in either direction is a direct pointer.",
  },
  {
    kind: "formula",
    tex: "\\text{global index: } O(m \\log n) \\qquad\\text{vs}\\qquad \\text{index-free adjacency: } O(m)",
    caption: "Cost of traversing m relationships in a graph of n nodes. Query time depends on the part of the graph searched, not on its total size.",
  },
  {
    kind: "prose",
    md: "**Native graph storage.** Neo4j keeps the graph in **separate store files** for nodes, relationships, labels and properties — the graph's **structure** is separate from its **property data**, which makes traversals fast even though the files look nothing like the user's view of the graph. Node and relationship stores use **fixed-size records**, so a record's position is simply **id × record size**: O(1) instead of an O(log n) search.",
  },
  {
    kind: "figure",
    src: "graph/neo4j-architecture.png",
    alt: "Neo4j architecture: Traversal API, Core API and Cypher on top; lock manager, transaction management, page cache, transaction log and record files; disks at the bottom.",
    width: 1564,
    height: 888,
    caption: "Neo4j's architecture, from the APIs down to the files on disk.",
  },
  {
    kind: "table",
    headers: ["Store", "Record contents (Neo4j 2.2)"],
    rows: [
      ["Node store (neostore.nodestore.db)", "9 bytes: in-use flag · id of first relationship · id of first property · labels (inlined or pointer to label store) · extra flags, e.g. densely connected node"],
      ["Relationship store (neostore.relationshipstore.db)", "Start and end node ids · pointer to relationship type · previous and next relationship of the start node · previous and next relationship of the end node · first-in-chain flag"],
      ["Property store (neostore.propertystore.db)", "Four property blocks and the id of the next property record; each property takes one to four blocks and holds its type, a pointer to the property name in the property index file, and an inlined value or a pointer to a dynamic store"],
      ["Dynamic stores (strings, arrays)", "Linked lists of fixed-size records for large property values"],
    ],
  },
  {
    kind: "figure",
    src: "graph/record-layout.jpg",
    alt: "Byte layout of a node record (inUse, nextRelId, nextPropId, labels, extra) and a relationship record (firstNode, secondNode, relationshipType, previous and next relationship ids for both nodes, nextPropId, firstInChainMarker).",
    width: 1456,
    height: 560,
    caption: "Node and relationship record layouts. This figure shows an earlier record format (15-byte nodes, 34-byte relationships); Neo4j 2.2 shrank node records to 9 bytes, but the fields are the same.",
  },
  {
    kind: "steps",
    title: "Following one relationship",
    steps: [
      { title: "Node → first relationship", md: "From the node record, take the id of its first relationship and multiply it by the relationship record size: the offset in the relationship store." },
      { title: "Walk the chain", md: "Relationship records form two **doubly linked lists**, one for the start node and one for the end node, so one record belongs to both nodes without being stored twice. Walk the node's list until a relationship of the right type (or with a matching property) is found." },
      { title: "Relationship → other node", md: "Read the other node's id from the relationship record and multiply it by the node record size: the offset in the node store. Type and label constraints are similar lookups in the type and label stores." },
      { title: "Properties when needed", md: "Follow the **singly linked list** of property records from the node's or relationship's first property. Short values such as phone numbers are **inlined**; property names are shared through the property index, saving space in repetitive graphs." },
    ],
  },
  {
    kind: "figure",
    src: "graph/relationship-chains.png",
    alt: "Node 1 (Person, name Bob, age 25) and Node 2 (Person, name Alice) linked by a LIKES relationship record that holds the previous and next relationship pointers for its start and end node.",
    width: 1496,
    height: 778,
    caption: "How a graph is physically stored: node records, a relationship record with its chain pointers, labels and property records.",
  },
  {
    kind: "prose",
    md: "**Caching.** Disks are slow next to memory, so Neo4j (from 2.2) uses an off-heap **LRU-K page cache**: each store is divided into regions, a fixed number of regions per store is cached, and pages are evicted by a least-frequently-used policy nuanced by popularity — unpopular pages leave first even if popular ones have not been touched recently.\n\n**APIs** form a stack, from expressive and declarative at the top to precise, imperative and *bare metal* at the bottom:\n\n- **Cypher** — declarative pattern matching; tolerant to changes in the graph's structure.\n- **Traversal Framework** — declarative Java: which relationship types and directions to follow, breadth- or depth-first, and an evaluator deciding at each node whether to include it and continue.\n- **Core API** — imperative Java over nodes, relationships, properties and labels; lazily evaluated for reads and transactional for writes. Often the fastest, but verbose and tightly coupled to the graph's structure.\n- **Kernel API** — transaction event handlers that react to transactions as they flow through the kernel, e.g. marking a node as logically deleted instead of deleting it.",
  },
  {
    kind: "figure",
    src: "graph/api-stack.png",
    alt: "API stack: user code on top; Cypher beside the Traverser API and the Core API; the kernel at the bottom.",
    width: 1026,
    height: 464,
    caption: "Neo4j's API stack.",
  },
  { kind: "concepts", ids: ["index-free-adjacency", "record-stores"] },
  {
    kind: "recall",
    cards: [
      { prompt: "What is index-free adjacency?", answer: "Each node directly references its adjacent relationships, so a hop is O(1) instead of an O(log n) global index lookup." },
      { prompt: "Why fixed-size records?", answer: "A record's offset is id × record size, an O(1) computation instead of a search." },
      { prompt: "Why are relationships in two doubly linked lists?", answer: "Each relationship belongs to its start and end node; one record sits in both nodes' chains, and double links allow iteration both ways and cheap inserts and deletes." },
      { prompt: "Core API versus Cypher?", answer: "Core API: imperative, fast, verbose, coupled to the graph's structure. Cypher: declarative, concise, tolerant to structural change." },
    ],
  },
  {
    kind: "practice",
    id: "l11-internals",
    tasks: [
      {
        id: "offset",
        prompt: "Node records are 9 bytes. At which byte offset does the record of node 250 start?",
        check: { mode: "text", accept: ["2250"], placeholder: "bytes" },
        solution: "250 × 9 = **2250** bytes into neostore.nodestore.db.",
      },
      {
        id: "cost",
        prompt: "A query follows 4 relationships in a graph of n = 1,048,576 nodes. Roughly how many index steps would a global B-tree-style index need in total (log₂ n per hop), versus index-free adjacency?",
        check: { mode: "open" },
        solution: "log₂ 1,048,576 = 20, so about **4 × 20 = 80** steps with a global index, versus **4** pointer hops with index-free adjacency — and the second number does not grow with the graph.",
      },
    ],
  },
];

const dependability: Block[] = [
  {
    kind: "prose",
    md: "**Transactions.** Neo4j is **ACID**, like a relational database. A transaction is an **in-memory object** holding its writes, backed by a **lock manager** that write-locks the nodes and relationships it touches. On commit the changes are appended to a **write-ahead log**; once the commit entry is flushed to disk they are durable, are applied to the graph, and the locks are released. On rollback the object is discarded and the locks released. Concurrent changes to the same elements are serialised, with deadlock detection. From a non-shell client every query is a transaction; in the shell, :begin and :commit group statements.\n\n**Recoverability.** After an unclean shutdown Neo4j **replays** the most recent transaction log. Replaying is **idempotent**, so transactions already applied do no harm, and the store ends up consistent with everything committed before the failure. In a cluster a recovered instance then asks the master for newer transactions and catches up.",
  },
  {
    kind: "prose",
    md: "**Availability.** Neo4j clusters are **master-slave**, with a **complete replica** of the graph on every machine. Writes go to the master and are replicated to the slaves at frequent intervals; some slaves may lag behind by milliseconds. The classic topology is **write-master, read-slaves**: writes scale only up to one machine, reads almost linearly. Neo4j also allows **writing through slaves**: the slave first catches up with the master, then commits synchronously on both — durable on two instances, at the cost of write latency; every write still passes through the master. **Graph-local**, idiomatic queries that start from a few significant nodes spread the load, use the caches well and reduce contention. Two load-balancing techniques help: **separate reads and writes**, and **cache sharding** — send requests for the same part of the graph to the same instance.\n\n**HA cluster.** Masters are elected automatically, and a returning old master rejoins as a slave. Coordination used to rely on **ZooKeeper** — set unique ids for the coordinators, configure them, start all three, and point each Neo4j server in HA mode at them — but newer versions coordinate themselves. A write to one slave is not immediately synchronised with the others, so the cluster as a whole is **eventually consistent**: in CAP terms Neo4j HA is **AP** and recommended for read-mostly workloads. neo4j-admin takes full and incremental **backups**.",
  },
  {
    kind: "figure",
    src: "graph/ha-coordinators.png",
    alt: "Three coordinator servers connected to each other and, through a cluster interface, to Neo4j 1 (master), Neo4j 2 (slave) and Neo4j 3 (slave).",
    width: 1126,
    height: 924,
    caption: "A ZooKeeper-style coordinated HA cluster: three coordinators, one master and two slaves.",
  },
  {
    kind: "figure",
    src: "graph/read-write-balancing.jpg",
    alt: "The application sends write requests to a write load balancer that targets the master and read requests to a read load balancer spread over all instances.",
    width: 1264,
    height: 950,
    caption: "Separating reads and writes: writes go to the master, reads to any instance.",
  },
  {
    kind: "figure",
    src: "graph/cache-sharding.jpg",
    alt: "A load balancer sends requests for A, B and C to different servers, each of which keeps the matching part of the graph in its cache.",
    width: 1320,
    height: 1032,
    caption: "Cache sharding: requests for the same part of the graph go to the same instance, so its cache stays warm.",
  },
  {
    kind: "table",
    headers: ["Scale dimension", "What it means for Neo4j"],
    rows: [
      ["Capacity (graph size)", "Tens of billions of nodes, relationships and properties (34.4 billion nodes and relationships) — limited by fixed record sizes and pointers"],
      ["Latency (response time)", "An index finds the start nodes; the rest is pointer chasing, so time depends on the data queried, not on the total size"],
      ["Throughput (reads and writes)", "Locality: one business operation works on a related subgraph and does less work — e.g. latest article of an author is O(1) by following WROTE to the head of a list, older ones via PREV"],
    ],
  },
  {
    kind: "figure",
    src: "graph/publishing-graph.jpg",
    alt: "Alice WROTE the newest article; each article points to the previous one with PREV.",
    width: 1426,
    height: 536,
    caption: "Constant-time reads and writes: the newest article is one WROTE hop away, older ones follow PREV.",
  },
  {
    kind: "prose",
    md: "Beyond one cluster, a graph must be **sharded by the application** with synthetic keys, like MongoDB: traversals inside one instance stay fast, but hops between instances cost as much as a join. Mozilla's Pancake stored many small per-user graphs, which shard trivially. Automatically partitioning an arbitrary graph across machines with few cross-machine traversals is **NP-hard** in general — the *holy grail* of graph scalability.\n\n**Strengths and weaknesses:** open source, scales well, typeless and schemaless, Lucene lookups, Cypher and REST, constant-time traversals, HA for read-heavy sites. But HA **replicates the whole graph, not subgraphs**, which limits graph size; the node/relationship naming differs from vertex/edge; and the Enterprise features (HA, backups) need a commercial or AGPL licence.",
  },
  { kind: "concepts", ids: ["neo4j-ha"] },
  {
    kind: "recall",
    cards: [
      { prompt: "How does Neo4j make a commit durable?", answer: "It appends the changes to a write-ahead log and flushes the commit entry to disk, then applies the changes and releases the write locks." },
      { prompt: "Why is replaying the log after a crash safe?", answer: "Replay is idempotent: re-applying already applied transactions gives the same result." },
      { prompt: "What is write-through-slave?", answer: "A slave receiving a write catches up with the master and commits synchronously on both, giving durability on two instances at higher latency." },
      { prompt: "Neo4j HA in CAP?", answer: "AP: slaves may serve data that lags behind the master; the cluster is eventually consistent." },
      { prompt: "Three dimensions of scale for a graph database?", answer: "Capacity (graph size), latency (response time) and read/write throughput." },
    ],
  },
];

const mistakes: Block[] = [
  { kind: "info", variant: "pitfall", title: "Confusing graph databases with graph analytics", md: "Neo4j stores and queries graphs; algorithms such as centrality or k-core are graph analytics on top of the data." },
  { kind: "info", variant: "pitfall", title: "Treating labels as types", md: "Nodes with the same label can have completely different properties. Neo4j enforces nothing unless you add constraints." },
  { kind: "info", variant: "pitfall", title: "Counting degrees as hops", md: "In an actor–movie graph one degree between actors is two ACTS_IN hops: two degrees need *1..4." },
  { kind: "info", variant: "pitfall", title: "Forgetting DISTINCT", md: "The same node can be reached along several paths; count(DISTINCT x) avoids counting it more than once." },
  { kind: "info", variant: "pitfall", title: "Putting multi-valued properties in a property table", md: "First normal form allows one value per column; multi-valued properties such as author go to the excess table." },
  { kind: "info", variant: "pitfall", title: "Calling Neo4j HA strongly consistent", md: "One instance is ACID, but a cluster's slaves may lag: HA is eventually consistent (AP) and aimed at reads." },
];

const quiz: Block[] = [{ kind: "prose", md: "Thirteen questions on graph models, RDF storage, Cypher and Neo4j internals." }];

const summary: Block[] = [
  { kind: "list", variant: "takeaways", items: lecture11Meta.takeaways },
  {
    kind: "table",
    headers: ["Concept", "Remember"],
    rows: [
      ["Property graph", "Labeled nodes, typed directed relationships, properties on both"],
      ["RDF", "(subject, predicate, object) triples; URIs mapped to ids; RDFS classes and properties"],
      ["Vertical table", "Statements(s, p, o): flexible, many self-joins"],
      ["Property table", "Common single-valued properties as columns + excess table"],
      ["Vertical partitioning", "One (URI, value) table per predicate; merge-joins; names only in table names"],
      ["Hexastore", "6 orders of s, p, o; each value indexed twice"],
      ["Cypher", "MATCH (a:L {p: v})-[:T]->(b) WHERE … RETURN …; *1..4; shortestPath; DISTINCT"],
      ["Gremlin", "g.V, g.E, outE, inV, out, in, both, filter{}; built on Pipes"],
      ["Index-free adjacency", "O(1) per hop, O(m) per traversal vs O(m log n)"],
      ["Record stores", "Fixed-size records; offset = id × size; node 9 bytes"],
      ["Neo4j HA", "Master-slave, full replicas, eventually consistent (AP), no subgraph sharding"],
    ],
  },
];

export const lecture11Blocks: SectionBlocks<typeof lecture11Outline> = {
  objectives,
  "why-graphs": whyGraphs,
  "property-graph": propertyGraph,
  rdf,
  "relational-storage": relationalStorage,
  cypher,
  "gremlin-rest": gremlinRest,
  internals,
  dependability,
  mistakes,
  quiz,
  summary,
};
