const {
  SeqScan,
  IndexScan,
  Filter,
  Projection,
  NestedLoopJoin,
  Insert
} = require("./operators");

function buildExecutor(plan, storageEngine) {
  switch (plan.constructor.name) {
    case "SeqScanNode":
      return new SeqScan({
        tableStorage: storageEngine.getTable(plan.tableName)
      });

    case "IndexScanNode":
      return new IndexScan({
        tableStorage: storageEngine.getTable(plan.tableName),
        indexStorage: storageEngine.getIndex(plan.indexName),
        value: plan.value
      });

    case "FilterNode":
      return new Filter({
        child: buildExecutor(plan.child, storageEngine),
        predicate: plan.predicate
      });

    case "ProjectionNode":
      return new Projection({
        child: buildExecutor(plan.child, storageEngine),
        columns: plan.columns
      });

    case "NestedLoopJoinNode":
      return new NestedLoopJoin({
        left: buildExecutor(plan.left, storageEngine),
        right: buildExecutor(plan.right, storageEngine),
        predicate: plan.predicate
      });

    case "InsertNode":
      return new Insert({
        tableStorage: storageEngine.getTable(plan.tableName),
        storageEngine,
        row: plan.row
      });

    default:
      throw new Error(`Unknown physical plan: ${plan.constructor.name}`);
  }
}

module.exports = { buildExecutor };
