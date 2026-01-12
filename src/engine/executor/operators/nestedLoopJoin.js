const { Operator } = require("./operator");
const { Row } = require("../../common/types");

class NestedLoopJoin extends Operator {
  constructor({ left, right, predicate }) {
    super();
    this.left = left;
    this.right = right;
    this.predicate = predicate;

    this.leftRow = null;
  }

  open() {
    this.left.open();
    this.right.open();
    this.leftRow = this.left.next();
  }

  next() {
    while (this.leftRow) {
      let rightRow;
      while ((rightRow = this.right.next())) {
        if (this.predicate(this.leftRow, rightRow)) {
          return new Row({
            ...this.leftRow.values,
            ...rightRow.values
          });
        }
      }
      this.right.close();
      this.right.open();
      this.leftRow = this.left.next();
    }
    return null;
  }

  close() {
    this.left.close();
    this.right.close();
  }
}

module.exports = { NestedLoopJoin };
