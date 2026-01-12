class TableStorage {
  constructor(tableSchema) {
    this.schema = tableSchema;
  }

  // Insert a row → returns RowID
  insert(row) {
    throw new Error("insert() not implemented");
  }

  // Fetch row by RowID
  get(rowId) {
    throw new Error("get() not implemented");
  }

  // Delete row by RowID
  delete(rowId) {
    throw new Error("delete() not implemented");
  }

  // Full table scan → iterator<Row>
  scan() {
    throw new Error("scan() not implemented");
  }
}

module.exports = { TableStorage };
