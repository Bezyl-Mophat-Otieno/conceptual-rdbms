const { RowID } = require("./rowId");

class InMemoryTableStorage {
  constructor(schema) {
    this.schema = schema;
    this.rows = [];
  }

  insert(row) {
    const rowId = new RowID(0, this.rows.length);
    this.rows.push(row);
    return rowId;
  }

  get(rowId) {
    return this.rows[rowId.slotId];
  }

  delete(rowId) {
    this.rows[rowId.slotId] = null;
  }

  *scan() {
    for (const row of this.rows) {
      if (row !== null) yield row;
    }
  }
}

module.exports = { InMemoryTableStorage };
