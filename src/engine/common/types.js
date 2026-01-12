/**
 * Supported primitive data types in the database.
 */
const DataType = Object.freeze({
  INT: "INT",
  STRING: "STRING",
  BOOLEAN: "BOOLEAN"
});

/**
 * Runtime representation of a column value.
 * Values are plain JS primitives or null.
 *
 * INT     -> number
 * STRING  -> string
 * BOOLEAN -> boolean
 * NULL    -> null
 */
function validateValue(type, value) {
  if (value === null) return true;

  switch (type) {
    case DataType.INT:
      return Number.isInteger(value);
    case DataType.STRING:
      return typeof value === "string";
    case DataType.BOOLEAN:
      return typeof value === "boolean";
    default:
      throw new Error(`Unknown data type: ${type}`);
  }
}

/**
 * Represents a table column.
 */
class Column {
  constructor({ name, type, primaryKey = false, unique = false, maxLength=null }) {
    this.name = name;
    this.type = type;
    this.primaryKey = primaryKey;
    this.unique = unique;
    this.maxLength = maxLength
  }
}

/**
 * Represents a table schema.
 */
class TableSchema {
  constructor(tableName, columns) {
    this.tableName = tableName;
    this.columns = columns; // array of Column
    this.columnMap = new Map();

    for (const column of columns) {
      if (this.columnMap.has(column.name)) {
        throw new Error(`Duplicate column: ${column.name}`);
      }
      this.columnMap.set(column.name, column);
    }
  }

  getColumn(name) {
    return this.columnMap.get(name);
  }

  hasColumn(name) {
    return this.columnMap.has(name);
  }
}

/**
 * Represents a row flowing through the engine.
 * Rows are plain JS objects keyed by column name.
 */
class Row {
  constructor(values) {
    this.values = Object.freeze({ ...values });
  }

  get(columnName) {
    return this.values[columnName];
  }

  toObject() {
    return { ...this.values };
  }
}

module.exports = {
  DataType,
  Column,
  TableSchema,
  Row,
  validateValue
};
