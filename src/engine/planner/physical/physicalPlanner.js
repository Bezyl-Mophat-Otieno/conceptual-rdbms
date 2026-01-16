const {
  SeqScanNode,
  IndexScanNode,
  FilterNode,
  ProjectionNode,
  NestedLoopJoinNode,
  InsertNode
} = require("./nodes");
const {compilePredicate} = require('./predicateCompiler')

class PhysicalPlanner {
  constructor(catalog) {
    this.catalog = catalog;
  }


  plan(logicalNode) {
    switch (logicalNode.type) {
      case "Scan":
        return new SeqScanNode({ tableName: logicalNode.tableName });

      case "Filter": {
        const child = this.plan(logicalNode.child);
        return this.planFilter(child, logicalNode.predicate);
      }

      case "Projection":
        return new ProjectionNode({
          child: this.plan(logicalNode.child),
          columns: logicalNode.columns
        });

      case "Join":
        return new NestedLoopJoinNode({
          left: this.plan(logicalNode.left),
          right: this.plan(logicalNode.right),
          predicate: logicalNode.predicate
        });

      case "Insert":
        return new InsertNode({
          tableName: logicalNode.tableName,
          row: logicalNode.row
        });

      default:
        throw new Error(`Unknown logical node: ${logicalNode.type}`);
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
  let left = new SeqScanNode({ tableName: from.tableName });

  for (const join of from.joins || []) {
    const right = new SeqScanNode({ tableName: join.table });

    const predicateFn = compilePredicate(join.on);

    left = new NestedLoopJoinNode({
      left,
      right,
      predicate: predicateFn
    });
  }

  return left;
}


  planFilter(child, predicate) {
  if (child instanceof SeqScanNode) {
    const table = this.catalog.getTable(child.tableName);
    const index = table
      .getIndexes()
      .find(i => i.columnName === predicate.left.column);

    if (index && predicate.operator === "=") {
      return new IndexScanNode({
        tableName: child.tableName,
        indexName: index.name,
        value: predicate.right.value
      });
    }
  }

  const predicateFn = compilePredicate(predicate);


  return new FilterNode({ child, predicate: predicateFn });
  }
  

applyFilter(child, predicate, tableName) {
  const table = this.catalog.getTable(tableName);

  const index = table
    .getIndexes()
    .find(idx => idx.columnName === predicate.left.column);

  // Index scan path
  if (index && predicate.operator === "=" && predicate.right.value !== undefined) {
    return new IndexScanNode({
      tableName,
      indexName: index.name,
      value: predicate.right.value
    });
  }

  // Sequential filter path
  const predicateFn = compilePredicate(predicate);

  return new FilterNode({
    child,
    predicate: predicateFn
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
