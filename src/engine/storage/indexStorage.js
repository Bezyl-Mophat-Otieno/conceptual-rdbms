class IndexStorage {
  constructor({ indexMeta }) {
    this.meta = indexMeta;
  }

  // Add entry
  insert(value, rowId) {
    throw new Error("insert() not implemented");
  }

  // Remove entry
  delete(value, rowId) {
    throw new Error("delete() not implemented");
  }

  // Lookup → iterator<RowID>
  lookup(value) {
    throw new Error("lookup() not implemented");
  }
}

module.exports = { IndexStorage };
