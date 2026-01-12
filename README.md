rdbms/
│
├─ package.json
├─ README.md
│
├─ src/
│   │
│   ├─ engine/                 # Core database engine
│   │   │
│   │   ├─ index.js             # Engine entry point (execute SQL)
│   │   │
│   │   ├─ parser/              # SQL → AST
│   │   │   ├─ tokenizer.js
│   │   │   ├─ parser.js
│   │   │   └─ ast.js
│   │   │
│   │   ├─ catalog/             # Metadata
│   │   │   ├─ catalog.js
│   │   │   ├─ table.js
│   │   │   └─ index.js
│   │   │
│   │   ├─ analyzer/            # Semantic analysis
│   │   │   └─ analyzer.js
│   │   │
│   │   ├─ planner/
│   │   │   ├─ logical/          # Logical plan
│   │   │   │   ├─ nodes.js
│   │   │   │   └─ logicalPlanner.js
│   │   │   │
│   │   │   ├─ physical/         # Physical plan
│   │   │   │   ├─ nodes.js
│   │   │   │   └─ physicalPlanner.js
│   │   │   │
│   │   │   └─ rules.js          # Simple planning rules
│   │   │
│   │   ├─ executor/             # Execute physical plans
│   │   │   ├─ executor.js
│   │   │   └─ operators/
│   │   │       ├─ seqScan.js
│   │   │       ├─ indexScan.js
│   │   │       ├─ nestedLoopJoin.js
│   │   │       ├─ filter.js
│   │   │       └─ projection.js
│   │   │
│   │   ├─ storage/              # Data persistence
│   │   │   ├─ storageEngine.js
│   │   │   ├─ tableStorage.js
│   │   │   └─ indexStorage.js
│   │   │
│   │   └─ common/
│   │       ├─ errors.js
│   │       └─ types.js
│   │
│   ├─ repl/                     # CLI client (later)
│   │   └─ repl.js
│   │
│   └─ web/                      # Demo web app (later)
│       └─ app.js
│
├─ data/
│   ├─ mydb/
│   │   ├─ catalog.json
│   │   ├─ users.table
│   │   ├─ orders.table
│   │   ├─ users_email.idx
│   │   └─ orders_user_id.idx
