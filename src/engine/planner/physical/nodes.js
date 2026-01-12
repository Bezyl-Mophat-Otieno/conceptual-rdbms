class PhysicalPlanNode {
  constructor() {
    this.children = [];
  }
}

class SeqScanNode extends PhysicalPlanNode {
  constructor({ tableName }) {
    super();
    this.tableName = tableName;
  }
}

class IndexScanNode extends PhysicalPlanNode {
  constructor({ tableName, indexName, value }) {
    super();
    this.tableName = tableName;
    this.indexName = indexName;
    this.value = value;
  }
}

class FilterNode extends PhysicalPlanNode {
  constructor({ child, predicate }) {
    super();
    this.child = child;
  }
}

class ProjectionNode extends PhysicalPlanNode {
  constructor({ child, columns }) {
    super();
    this.child = child;
    this.columns = columns;
  }
}

class NestedLoopJoinNode extends PhysicalPlanNode {
  constructor({ left, right, predicate }) {
    super();
    this.left = left;
    this.right = right;
  }
}

class InsertNode extends PhysicalPlanNode {
  constructor({ tableName, row }) {
    super();
    this.tableName = tableName;
    this.row = row;
  }
}

module.exports = {
  SeqScanNode,
  IndexScanNode,
  FilterNode,
  ProjectionNode,
  NestedLoopJoinNode,
  InsertNode
};
