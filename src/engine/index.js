const { tokenize } = require("./parser/tokenizer");
const { Parser } = require("./parser/parser");
const { Analyzer } = require("./analyzer/analyzer");
const { LogicalPlanner } = require("./planner/logical/logicalPlanner");
const { PhysicalPlanner } = require("./planner/physical/physicalPlanner");
const { Executor } = require("./executor/executor");
const { buildExecutor } = require("./executor/planBuilder");

class Engine {
  constructor({ catalog, storageEngine }) {
    this.catalog = catalog;
    this.storageEngine = storageEngine;

    this.analyzer = new Analyzer(catalog);
    this.logicalPlanner = new LogicalPlanner();
    this.physicalPlanner = new PhysicalPlanner(catalog);
    this.executor = new Executor();
  }

  async execute(sql) {
    // 1. Parse
    const tokens = tokenize(sql);
    const ast = new Parser(tokens).parse();

    // 2. Analyze
    const analyzedAst = this.analyzer.analyze(ast);

    // 3. Logical plan
    const logicalPlan = this.logicalPlanner.plan(analyzedAst);

    // 4. Physical plan
    const physicalPlan = this.physicalPlanner.plan(logicalPlan);

    // 5. Build executor operators
    const executablePlan = buildExecutor(
      physicalPlan,
      this.storageEngine
    );

    // 6. Execute
    return this.executor.execute(executablePlan);
  }
}

module.exports = { Engine };
