const { TableMetadata } = require("./table");
const { FileCatalogStorage } = require("./FileCatalogStorage");

class Catalog {
  constructor({ dbPath }) {
    this.tables = new Map();
    this.storage = new FileCatalogStorage(dbPath);
    this._load();
  }

  _load() {
    const raw = this.storage.load();
    this.tables = this.storage.deserialize(raw);
  }

  _persist() {
    const serialized = this.storage.serialize(this);
    this.storage.save(serialized);
  }

  // ---- Table operations ----

  createTable(tableSchema) {
    if (this.tables.has(tableSchema.tableName)) {
      throw new Error(`Table already exists: ${tableSchema.tableName}`);
    }

    const meta = new TableMetadata(tableSchema);
    this.tables.set(tableSchema.tableName, meta);
    this._persist();
  }

  dropTable(tableName) {
    this.tables.delete(tableName);
    this._persist();
  }

  hasTable(tableName) {
    return this.tables.has(tableName);
  }

  getTable(tableName) {
    const table = this.tables.get(tableName);
    if (!table) throw new Error(`Table not found: ${tableName}`);
    return table;
  }

  // ---- Index operations ----

  createIndex(indexMeta) {
    const table = this.getTable(indexMeta.tableName);
    table.addIndex(indexMeta);
    this._persist();
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
