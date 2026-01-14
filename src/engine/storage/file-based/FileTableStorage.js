const fs = require("node:fs");
const readline = require("node:readline");
const path = require("node:path");
const { RowID } = require("./rowId");

class FileTableStorage {
  constructor(dbPath, tableName) {
    this.tablePath = path.join(dbPath, `${tableName}.table`);

    // Ensure file exists
    if (!fs.existsSync(this.tablePath)) {
      fs.writeFileSync(this.tablePath, "");
    }
  }

  /**
   * Append a row to the table file
   */
  insert(row) {
    const serialized = JSON.stringify(row) + "\n";

    const stats = fs.statSync(this.tablePath);
    const lineNumber = stats.size === 0
      ? 0
      : fs.readFileSync(this.tablePath, "utf-8").split("\n").length - 1;

    fs.appendFileSync(this.tablePath, serialized);

    return new RowID(lineNumber);
  }

  /**
   * Fetch a row by RowID (line number)
   */
  get(rowId) {
    const lines = fs.readFileSync(this.tablePath, "utf-8").split("\n");

    const line = lines[rowId.lineNumber];
    if (!line) return null;

    return JSON.parse(line);
  }

  /**
   * Sequential scan of all rows
   */
  async *scan() {
    const fileStream = fs.createReadStream(this.tablePath);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    for await (const line of rl) {
      if (line.trim().length === 0) continue;
      yield JSON.parse(line);
    }
  }
}

module.exports = { FileTableStorage };
