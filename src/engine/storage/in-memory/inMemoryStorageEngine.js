const { InMemoryTableStorage } = require("./inMemoryTableStorage");
const { InMemoryIndexStorage } = require("./inMemoryIndexStorage");

class InMemoryStorageEngine {
  constructor(catalog) {
    this.catalog = catalog;
    this.tables = new Map();
    this.indexes = new Map();
  }

  createTable(tableSchema) {
    this.tables.set(
      tableSchema.tableName,
      new InMemoryTableStorage(tableSchema)
    );
  }

  createIndex(indexMeta) {
    this.indexes.set(
      indexMeta.name,
      new InMemoryIndexStorage(indexMeta)
    );
  }

  insertRow(tableName, row) {
    const table = this.tables.get(tableName);
    const rowId = table.insert(row);

    const tableMeta = this.catalog.getTable(tableName);
    for (const index of tableMeta.getIndexes()) {
      const value = row.get(index.columnName);
      this.indexes.get(index.name).insert(value, rowId);
    }

    return rowId;
  }

  getTable(tableName) {
    return this.tables.get(tableName);
  }

  getIndex(indexName) {
    return this.indexes.get(indexName);
  }
}

module.exports = { InMemoryStorageEngine };
