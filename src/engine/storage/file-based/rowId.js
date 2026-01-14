class RowID {
  constructor(lineNumber) {
    this.lineNumber = lineNumber;
  }

  toString() {
    return String(this.lineNumber);
  }
}

module.exports = { RowID };
