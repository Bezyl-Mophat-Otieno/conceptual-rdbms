const { Operator } = require("./operator");

class Filter extends Operator {
  constructor({ child, predicate }) {
    super();
    this.child = child;
    this.predicate = predicate;
  }

  open() {
    this.child.open();
  }

  next() {
    while (true) {
      const row = this.child.next();
      if (!row) return null;
      if (this.predicate(row)) return row;
    }
  }

  close() {
    this.child.close();
  }
}

module.exports = { Filter };
