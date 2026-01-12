class LogicalPlanNode {
  constructor(type) {
    this.type = type;
  }
}

class LogicalScan extends LogicalPlanNode {
  constructor({ tableName }) {
    super("Scan");
    this.tableName = tableName;
  }
}

class LogicalFilter extends LogicalPlanNode {
  constructor({ child, predicate }) {
    super("Filter");
    this.child = child;
    this.predicate = predicate;
  }
}

class LogicalProjection extends LogicalPlanNode {
  constructor({ child, columns }) {
    super("Projection");
    this.child = child;
    this.columns = columns;
  }
}

class LogicalJoin extends LogicalPlanNode {
  constructor({ left, right, predicate }) {
    super("Join");
    this.left = left;
    this.right = right;
    this.predicate = predicate;
  }
}

class LogicalInsert extends LogicalPlanNode {
  constructor({ tableName, row }) {
    super("Insert");
    this.tableName = tableName;
    this.row = row;
  }
}

module.exports = {
  LogicalScan,
  LogicalFilter,
  LogicalProjection,
  LogicalJoin,
  LogicalInsert
};
