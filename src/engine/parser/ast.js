class SelectStatement {
  constructor({ columns, from, where }) {
    this.type = "Select";
    this.columns = columns;
    this.from = from;
    this.where = where;
  }
}

class InsertStatement {
  constructor({ table, values }) {
    this.type = "Insert";
    this.table = table;
    this.values = values;
  }
}

class FromClause {
  constructor({ table, alias, joins = [] }) {
    this.table = table;
    this.alias = alias;
    this.joins = joins;
  }
}

class JoinClause {
  constructor({ table, alias, on }) {
    this.table = table;
    this.alias = alias;
    this.on = on;
  }
}

class ColumnRef {
  constructor(name) {
    this.type = "Column";
    this.name = name;
  }
}

class Literal {
  constructor(value) {
    this.type = "Literal";
    this.value = value;
  }
}

class Predicate {
  constructor({ left, operator, right }) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
}

module.exports = {
  SelectStatement,
  InsertStatement,
  FromClause,
  JoinClause,
  ColumnRef,
  Literal,
  Predicate
};
