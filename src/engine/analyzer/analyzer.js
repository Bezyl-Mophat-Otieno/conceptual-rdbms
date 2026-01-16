const {validateValue} = require('../common/types')
const {Row} = require('../common/types')
class Analyzer {
  constructor(catalog) {
    this.catalog = catalog;
  }

  analyze(ast) {
    switch (ast.type) {
      case "Select":
        return this.analyzeSelect(ast);
      case "Insert":
        return this.analyzeInsert(ast);
      default:
        throw new Error(`Unsupported AST node: ${ast.type}`);
    }
  }

  analyzeSelect(ast) {
    const tableScopes = this.resolveFrom(ast.from);

    let where = null;
    if (ast.where) {
      where = this.resolvePredicate(ast.where, tableScopes);
    }

    const columns = ast.columns.map(col =>
      this.resolveColumn(col, tableScopes)
    );

    return {
      ...ast,
      columns,
      where,
      scopes: tableScopes
    };
  }

analyzeInsert(ast) {
  const table = this.catalog.getTable(ast.table);
  const schema = table.schema;

  if (ast.values.length !== schema.columns.length) {
    throw new Error("Column count does not match VALUES count");
  }

  const rowValues = {};

  schema.columns.forEach((column, i) => {
    const literal = ast.values[i];

    console.log("literal",literal)

    if (!validateValue(column.type, literal.value)) {
      throw new Error(
        `Invalid value for column ${column.name}: ${literal.value}`
      );
    }

    rowValues[column.name] = literal.value;
  });

  console.log("rowValues",rowValues)

  return {
    type: "Insert",
    table: ast.table,
    row: new Row(rowValues)
  };
}

  resolveFrom(from) {
    const scopes = [];

    // Base table
    scopes.push(this.resolveTable(from.table, from.alias));

    // Joins
    for (const join of from.joins || []) {
      scopes.push(this.resolveTable(join.table, join.alias));
      join.on = this.resolvePredicate(join.on, scopes);
    }

    return scopes;
  }

  resolveTable(tableName, alias) {
    const table = this.catalog.getTable(tableName);
    return {
      tableName,
      alias: alias || tableName,
      schema: table.schema
    };
  }

  resolveColumn(columnRef, scopes) {
    const matches = [];

    for (const scope of scopes) {
      const column = scope.schema.getColumn(columnRef.name);
      if (column) {
        matches.push({
          table: scope.alias,
          column: column.name,
          type: column.type
        });
      }
    }

    if (matches.length === 0) {
      throw new Error(`Unknown column: ${columnRef.name}`);
    }

    if (matches.length > 1) {
      throw new Error(`Ambiguous column: ${columnRef.name}`);
    }

    return matches[0];
  }

  resolvePredicate(predicate, scopes) {
    const left = this.resolveColumn(predicate.left, scopes);
    const right = predicate.right.type === "Column"
      ? this.resolveColumn(predicate.right, scopes)
      : predicate.right;

    if (right.type && left.type.name !== right.type.name) {
      throw new Error("Type mismatch in predicate");
    }

    return {
      ...predicate,
      left,
      right
    };
  }
}

module.exports = { Analyzer };
