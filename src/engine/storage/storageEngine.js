class StorageEngine {
  constructor(catalog) {
    this.catalog = catalog;
    this.tables = new Map();  // tableName → TableStorage
    this.indexes = new Map(); // indexName → IndexStorage
  }

  // Called after CREATE TABLE
  createTable(tableSchema) {
    throw new Error("createTable() not implemented");
  }

  // Called after CREATE INDEX
  createIndex(indexMeta) {
    throw new Error("createIndex() not implemented");
  }

  // Get table storage
  getTable(tableName) {
    const table = this.tables.get(tableName);
    if (!table) throw new Error(`No storage for table ${tableName}`);
    return table;
  }

  // Get index storage
  getIndex(indexName) {
    return this.indexes.get(indexName);
  }
}

module.exports = { StorageEngine };
