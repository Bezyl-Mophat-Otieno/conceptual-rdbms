class IndexMetadata {
  constructor({ name, tableName, columnName, unique = false }) {
    this.name = name;
    this.tableName = tableName;
    this.columnName = columnName;
    this.unique = unique;
  }
}

module.exports = { IndexMetadata };
