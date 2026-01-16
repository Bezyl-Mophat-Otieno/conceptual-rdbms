const { TableMetadata } = require("./table");

class Catalog {
  constructor() {
    this.tables = new Map(); // tableName -> TableMetadata
  }

  // ---- Table operations ----

  createTable(tableSchema) {
    if (this.tables.has(tableSchema.tableName)) {
      throw new Error(`Table already exists: ${tableSchema.tableName}`);
    }

    const tableMeta = new TableMetadata(tableSchema);
    this.tables.set(tableSchema.tableName, tableMeta);
  }

  dropTable(tableName) {
    this.tables.delete(tableName);
  }

  hasTable(tableName) {
    return this.tables.has(tableName);
  }

  getTable(tableName) {
    const table = this.tables.get(tableName);
    if (!table) {
      throw new Error(`Table not found: ${tableName}`);
    }
    return table;
  }

  // ---- Index operations ----

  createIndex(indexMeta) {
    const table = this.getTable(indexMeta.tableName);
    table.addIndex(indexMeta);
  }

  getIndexesForTable(tableName) {
    return this.getTable(tableName).getIndexes();
  }

  getIndex(tableName, indexName) {
    return this.getTable(tableName).getIndex(indexName);
  }

  // ---- Introspection ----

  getTables() {
    return Array.from(this.tables.keys());
  }
  getIndexes() {
    return Array.from(this.tables.values).map((table)=> table.indexes)
  }
}

module.exports = { Catalog };
