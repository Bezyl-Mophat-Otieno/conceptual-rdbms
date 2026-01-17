const fs = require("node:fs");
const path = require("node:path");
const { TableSchema, Column } = require("../common/types");
const { TableMetadata } = require("./table");
const { IndexMetadata } = require("./index");

class FileCatalogStorage {
  constructor(dbPath) {
    this.catalogPath = path.join(dbPath, "catalog.json");
  }

  load() {
    if (!fs.existsSync(this.catalogPath)) {
      return { tables: {} };
    }

    return JSON.parse(fs.readFileSync(this.catalogPath, "utf-8"));
  }

  save(catalogState) {
    fs.writeFileSync(
      this.catalogPath,
      JSON.stringify(catalogState, null, 2)
    );
  }

  serialize(catalog) {
    const tables = {};

    for (const [tableName, meta] of catalog.tables.entries()) {
      tables[tableName] = {
        schema: {
          tableName: meta.schema.tableName,
          columns: meta.schema.columns.map(c => ({
            name: c.name,
            type: c.type,
            primaryKey: c.primaryKey,
            unique: c.unique,
            maxLength: c.maxLength
          }))
        },
        indexes: meta.getIndexes().map(idx => ({
          name: idx.name,
          tableName: idx.tableName,
          columnName: idx.columnName,
          unique: idx.unique
        }))
      };
    }

    return { tables };
  }

  deserialize(raw) {
    const tables = new Map();

    for (const [tableName, data] of Object.entries(raw.tables)) {
      const columns = data.schema.columns.map(
        c => new Column(c)
      );

      const schema = new TableSchema(tableName, columns);
      const tableMeta = new TableMetadata(schema);

      for (const idx of data.indexes) {
        tableMeta.addIndex(new IndexMetadata(idx));
      }

      tables.set(tableName, tableMeta);
    }

    return tables;
  }
}

module.exports = { FileCatalogStorage };
