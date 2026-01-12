const { Operator } = require("./operator");

class IndexScan extends Operator {
  constructor({ indexStorage, tableStorage, value }) {
    super();
    this.indexStorage = indexStorage;
    this.tableStorage = tableStorage;
    this.value = value;
    this.rowIdIterator = null;
  }

  open() {
    this.rowIdIterator = this.indexStorage.lookup(this.value);
  }

  next() {
    const { value: rowId, done } = this.rowIdIterator.next();
    if (done) return null;
    return this.tableStorage.get(rowId);
  }

  close() {
    this.rowIdIterator = null;
  }
}

module.exports = { IndexScan };
