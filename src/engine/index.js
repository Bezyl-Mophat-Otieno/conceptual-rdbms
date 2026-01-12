const { parse } = require("./parser/parser");
const { analyze } = require("./analyzer/analyzer");
const { buildLogicalPlan } = require("./planner/logical/logicalPlanner");
const { buildPhysicalPlan } = require("./planner/physical/physicalPlanner");
const { executePlan } = require("./executor/executor");

class DatabaseEngine {
  execute(sql) {
    const ast = parse(sql);
    const boundAst = analyze(ast);
    const logicalPlan = buildLogicalPlan(boundAst);
    const physicalPlan = buildPhysicalPlan(logicalPlan);
    return executePlan(physicalPlan);
  }
}

module.exports = { DatabaseEngine };
