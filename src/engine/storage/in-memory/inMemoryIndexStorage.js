class InMemoryIndexStorage {
  constructor(indexMeta) {
    this.meta = indexMeta;
    this.map = new Map(); // value → Set<RowID>
  }

  insert(value, rowId) {
    if (!this.map.has(value)) {
      this.map.set(value, new Set());
    }
    this.map.get(value).add(rowId);
  }

  delete(value, rowId) {
    this.map.get(value)?.delete(rowId);
  }

  *lookup(value) {
    const set = this.map.get(value);
    if (!set) return;
    for (const rowId of set) yield rowId;
  }
}

module.exports = { InMemoryIndexStorage };
