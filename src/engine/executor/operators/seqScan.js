const { Operator } = require("./operator");

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
    return done ? null : value;
  }

  close() {
    this.iterator = null;
  }
}

module.exports = { SeqScan };
