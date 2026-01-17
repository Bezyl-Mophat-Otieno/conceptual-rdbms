const { Operator } = require("./operator");
const {Row} = require("../../common/types")

class SeqScan extends Operator {
  constructor({ tableStorage }) {
    super();
    this.tableStorage = tableStorage;
    this.iterator = null;
  }

  open() {
    this.iterator = this.tableStorage.scan();
  }

  next() {
    const { value, done } = this.iterator.next();
    return done ? null : new Row(value);
  }

  close() {
    this.iterator = null;
  }
}

module.exports = { SeqScan };
