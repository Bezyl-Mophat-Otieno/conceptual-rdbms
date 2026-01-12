const {
  SelectStatement,
  InsertStatement,
  FromClause,
  JoinClause,
  ColumnRef,
  Literal,
  Predicate
} = require("./ast");

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  parse() {
    const token = this.peek();
    if (token.value === "SELECT") return this.parseSelect();
    if (token.value === "INSERT") return this.parseInsert();
    throw new Error("Unsupported SQL statement");
  }

  parseSelect() {
    this.expect("SELECT");
    const columns = this.parseColumns();
    this.expect("FROM");
    const from = this.parseFrom();

    let where = null;
    if (this.peek()?.value === "WHERE") {
      this.expect("WHERE");
      where = this.parsePredicate();
    }

    return new SelectStatement({ columns, from, where });
  }

  parseInsert() {
    this.expect("INSERT");
    this.expect("INTO");
    const table = this.consume().value;
    this.expect("VALUES");
    this.expect("(");
    const values = [];
    while (this.peek().value !== ")") {
      values.push(this.parseLiteral());
      if (this.peek().value === ",") this.consume();
    }
    this.expect(")");
    return new InsertStatement({ table, values });
  }

  parseColumns() {
    const columns = [];
    while (this.peek().value !== "FROM") {
      const token = this.consume();
      if (token.value !== ",") {
        columns.push(new ColumnRef(token.value));
      }
    }
    return columns;
  }

  parseFrom() {
    const table = this.consume().value;
    const joins = [];

    while (this.peek()?.value === "JOIN") {
      this.consume();
      const joinTable = this.consume().value;
      this.expect("ON");
      const predicate = this.parsePredicate();
      joins.push(new JoinClause({ table: joinTable, on: predicate }));
    }

    return new FromClause({ table, joins });
  }

  parsePredicate() {
    const left = new ColumnRef(this.consume().value);
    const operator = this.consume().value;
    const right = this.parseLiteralOrColumn();
    return new Predicate({ left, operator, right });
  }

  parseLiteralOrColumn() {
    const token = this.consume();
    if (token.type === "NUMBER" || token.type === "STRING") {
      return new Literal(token.value);
    }
    return new ColumnRef(token.value);
  }

  parseLiteral() {
    const token = this.consume();
    return new Literal(token.value);
  }

  peek() {
    return this.tokens[this.pos];
  }

  consume() {
    return this.tokens[this.pos++];
  }

  expect(value) {
    const token = this.consume();
    if (token.value !== value) {
      throw new Error(`Expected ${value} but got ${token.value}`);
    }
  }
}

module.exports = { Parser };
