const { Operator } = require("./operator");
const {Row} = require("../../common/types")

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

    const raw = this.tableStorage.get(rowId);
    return raw ? new Row(raw) : null;
  }

  close() {
    this.rowIdIterator = null;
  }
}

module.exports = { IndexScan };
