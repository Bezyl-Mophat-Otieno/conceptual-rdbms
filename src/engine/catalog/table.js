const { TableSchema } = require("../common/types");

class TableMetadata {
  constructor(schema) {
    if (!(schema instanceof TableSchema)) {
      throw new TypeError("TableMetadata requires a TableSchema");
    }

    this.schema = schema;
    this.name = schema.tableName;
    this.indexes = new Map(); // indexName -> IndexMetadata
  }

  addIndex(indexMeta) {
    this.indexes.set(indexMeta.name, indexMeta);
  }

  getIndex(indexName) {
    return this.indexes.get(indexName);
  }

  getIndexes() {
    return Array.from(this.indexes.values());
  }
}

module.exports = { TableMetadata };
