const fs = require("node:fs");
const path = require("node:path");
const { FileTableStorage } = require("./FileTableStorage");
const { FileIndexStorage } = require("./FileIndexStorage");

class FileStorageEngine {
  constructor(catalog, dbPath) {
    this.catalog = catalog;
    this.dbPath = dbPath;

    // Ensure DB directory exists
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true });
    }

    this.tables = new Map();
    this.indexes = new Map();

    this._loadExistingTables();
    this._loadExistingIndexes();
  }

  /**
   * Initialize table storage from catalog
   */
  _loadExistingTables() {
    for (const table of this.catalog.getTables()) {
      const tableStorage = new FileTableStorage(
        this.dbPath,
        table.tableName
      );
      this.tables.set(table.tableName, tableStorage);
    }
  }

  /**
   * Initialize index storage from catalog
   */
  _loadExistingIndexes() {
    for (const index of this.catalog.getIndexes()) {
      const indexStorage = new FileIndexStorage(
        this.dbPath,
        index.name,
        { unique: index.unique }
      );
      this.indexes.set(index.name, indexStorage);
    }
  }

  /**
   * Create a new table
   */
  createTable(tableSchema) {
    const tableName = tableSchema.tableName;

    if (this.tables.has(tableName)) {
      throw new Error(`Table '${tableName}' already exists`);
    }

    this.catalog.createTable(tableSchema);

    const tableStorage = new FileTableStorage(
      this.dbPath,
      tableName
    );

    this.tables.set(tableName, tableStorage);
  }

  /**
   * Create a new index
   */
  createIndex(indexMeta) {
    const indexName = indexMeta.name;

    if (this.indexes.has(indexName)) {
      throw new Error(`Index '${indexName}' already exists`);
    }

    this.catalog.createIndex(indexMeta);

    const indexStorage = new FileIndexStorage(
      this.dbPath,
      indexName,
      { unique: indexMeta.unique }
    );

    this.indexes.set(indexName, indexStorage);
  }

  /**
   * Insert a row and update indexes
   */
  insertRow(tableName, row) {
    const tableStorage = this.tables.get(tableName);
    if (!tableStorage) {
      throw new Error(`Unknown table '${tableName}'`);
    }

    const rowId = tableStorage.insert(row);

    const tableMeta = this.catalog.getTable(tableName);
    for (const index of tableMeta.getIndexes()) {
      const value = row.get(index.columnName);
      const indexStorage = this.indexes.get(index.name);
      indexStorage.insert(value, rowId);
    }

    return rowId;
  }

  /**
   * Access table storage
   */
  getTable(tableName) {
    const table = this.tables.get(tableName);
    if (!table) {
      throw new Error(`Table '${tableName}' not found`);
    }
    return table;
  }

  /**
   * Access index storage
   */
  getIndex(indexName) {
    const index = this.indexes.get(indexName);
    if (!index) {
      throw new Error(`Index '${indexName}' not found`);
    }
    return index;
  }
}

module.exports = { FileStorageEngine };
