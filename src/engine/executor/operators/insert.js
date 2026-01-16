const { Operator } = require("./operator");

class Insert extends Operator {
  constructor({ tableStorage, storageEngine, row }) {
    super();
    this.tableStorage = tableStorage;
    this.storageEngine = storageEngine;
    this.row = row;
    this.done = false;
  }

  open() {}

  next() {
    if (this.done) return null;
    this.storageEngine.insertRow(this.tableStorage.tableName, this.row);
    this.done = true;
    return null;
  }
}

module.exports = { Insert };
