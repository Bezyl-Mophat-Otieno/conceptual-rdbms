const { Operator } = require("./operator");
const { Row } = require("../../common/types");

class Projection extends Operator {
  constructor({ child, columns }) {
    super();
    this.child = child;
    this.columns = columns;
  }

  open() {
    this.child.open();
  }

  next() {
    const row = this.child.next();
    if (!row) return null;

    const values = {};
    for (const col of this.columns) {
      values[col] = row.get(col);
    }
    return new Row(values);
  }

  close() {
    this.child.close();
  }
}

module.exports = { Projection };
