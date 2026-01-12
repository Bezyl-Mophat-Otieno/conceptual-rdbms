class RowID {
  constructor(pageId, slotId) {
    this.pageId = pageId;
    this.slotId = slotId;
  }

  toString() {
    return `${this.pageId}:${this.slotId}`;
  }
}

module.exports = { RowID };
