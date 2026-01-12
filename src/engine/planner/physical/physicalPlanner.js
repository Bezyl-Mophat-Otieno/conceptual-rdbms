const {
  SeqScanNode,
  IndexScanNode,
  FilterNode,
  ProjectionNode,
  NestedLoopJoinNode,
  InsertNode
} = require("./nodes");

class PhysicalPlanner {
  constructor(catalog) {
    this.catalog = catalog;
  }

  plan(logicalPlan) {
    switch (logicalPlan.type) {
      case "Select":
        return this.planSelect(logicalPlan);
      case "Insert":
        return this.planInsert(logicalPlan);
      default:
        throw new Error(`Unsupported logical plan: ${logicalPlan.type}`);
    }
  }

  planSelect(plan) {
    let root = this.planFrom(plan.from);

    if (plan.where) {
      root = this.applyFilter(root, plan.where, plan.from.tableName);
    }

    if (plan.projection) {
      root = new ProjectionNode({
        child: root,
        columns: plan.projection
      });
    }

    return root;
  }

  planFrom(from) {
    return new SeqScanNode({ tableName: from.tableName });
  }

  applyFilter(child, predicate, tableName) {
    const table = this.catalog.getTable(tableName);
    const index = table
      .getIndexes()
      .find(idx => idx.columnName === predicate.column);

    if (index && predicate.operator === "=") {
      return new IndexScanNode({
        tableName,
        indexName: index.name,
        value: predicate.value
      });
    }

    return new FilterNode({
      child,
      predicate
    });
  }

  planInsert(plan) {
    return new InsertNode({
      tableName: plan.tableName,
      row: plan.row
    });
  }
}

module.exports = { PhysicalPlanner };
