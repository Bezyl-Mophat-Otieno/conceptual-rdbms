const path = require("node:path");
const { Engine } = require("../engine");
const { Catalog } = require("../engine/catalog/catalog");
const { FileStorageEngine } = require("../engine/storage/file-based/FileStorageEngine");
const { TableSchema, Column, DataType } = require("../engine/common/types");

const dbPath = path.join(__dirname, "../../data/mydb")
const catalog = new Catalog();
const storageEngine = new FileStorageEngine(catalog, dbPath);
const usersTableSchema=  new TableSchema("users", [
    new Column({ name: "id", type: DataType.INT, primaryKey: true }),
    new Column({ name: "name", type: DataType.STRING, maxLength: 30 })
  ])

storageEngine.createTable(usersTableSchema);

const engine = new Engine({ catalog, storageEngine });

(async () => {
  await engine.execute("INSERT INTO users VALUES (1, 'Alice')");
  const result = await engine.execute("SELECT name FROM users WHERE id = 1");
  console.log("SELECT name FROM users WHERE id = 1. RESULT", result)
})();
