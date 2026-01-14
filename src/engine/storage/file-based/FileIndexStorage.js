const fs = require("node:fs");
const path = require("node:path");
const { RowID } = require("./rowId");

class FileIndexStorage {
  constructor(dbPath, indexName, { unique = false } = {}) {
    this.indexPath = path.join(dbPath, `${indexName}.idx`);
    this.unique = unique;

    // Ensure index file exists
    if (!fs.existsSync(this.indexPath)) {
      fs.writeFileSync(this.indexPath, JSON.stringify({}));
    }
  }

  /**
   * Load entire index file into memory
   * (acceptable for this project scope)
   */
  _load() {
    const raw = fs.readFileSync(this.indexPath, "utf-8");
    return raw ? JSON.parse(raw) : {};
  }

  /**
   * Persist index back to disk
   */
  _save(index) {
    fs.writeFileSync(this.indexPath, JSON.stringify(index, null, 2));
  }

  /**
   * Insert value → RowID mapping
   */
  insert(value, rowId) {
    const index = this._load();
    const key = String(value);

    if (!index[key]) {
      index[key] = [];
    }

    if (this.unique && index[key].length > 0) {
      throw new Error(
        `Unique index violation for value '${value}'`
      );
    }

    index[key].push(rowId.lineNumber);
    this._save(index);
  }

  /**
   * Lookup RowIDs for a value
   */
  *lookup(value) {
    const index = this._load();
    const key = String(value);

    const entries = index[key];
    if (!entries) return;

    for (const lineNumber of entries) {
      yield new RowID(lineNumber);
    }
  }

  /**
   * Delete a RowID from index
   * (used for DELETE / UPDATE later)
   */
  delete(value, rowId) {
    const index = this._load();
    const key = String(value);

    if (!index[key]) return;

    index[key] = index[key].filter(
      ln => ln !== rowId.lineNumber
    );

    if (index[key].length === 0) {
      delete index[key];
    }

    this._save(index);
  }
}

module.exports = { FileIndexStorage };
