const {
  LogicalScan,
  LogicalFilter,
  LogicalProjection,
  LogicalJoin,
  LogicalInsert
} = require("./nodes");

class LogicalPlanner {
  plan(ast) {
    switch (ast.type) {
      case "Select":
        return this.planSelect(ast);
      case "Insert":
        return new LogicalInsert({
          tableName: ast.table,
          row: ast.row
        });
      default:
        throw new Error(`Unsupported AST node: ${ast.type}`);
    }
  }

  planSelect(ast) {
    let root = this.planFrom(ast.from);

    if (ast.where) {
      root = new LogicalFilter({
        child: root,
        predicate: ast.where
      });
    }

    root = new LogicalProjection({
      child: root,
      columns: ast.columns
    });

    return root;
  }

  planFrom(from) {
    let left = new LogicalScan({ tableName: from.table });

    for (const join of from.joins || []) {
      const right = new LogicalScan({ tableName: join.table });
      left = new LogicalJoin({
        left,
        right,
        predicate: join.on
      });
    }

    return left;
  }
}

module.exports = { LogicalPlanner };
