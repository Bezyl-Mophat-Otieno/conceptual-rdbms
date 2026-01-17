const readline = require("node:readline");
const path = require("node:path");

const { Engine } = require("../engine");
const { Catalog } = require("../engine/catalog/catalog");
const { FileStorageEngine } = require("../engine/storage/file-based/FileStorageEngine");

/**
 * Pretty print rows returned from SELECT
 */
function printRows(rows) {
  if (!rows || rows.length === 0) {
    console.log("(no rows)");
    return;
  }

  for (const row of rows) {
    if (typeof row.toObject === "function") {
      console.log(row.toObject());
    } else {
      console.log(row);
    }
  }
}

/**
 * Handle REPL meta commands
 */
function handleMetaCommand(cmd, { catalog }) {
  switch (cmd) {
    case ".help":
            console.log(`
            .help           Show help
            .exit           Exit the REPL
            .tables         List tables
            .schema <name>  Show table schema
            `.trim());
      return true;

    case ".tables":
      for (const table of catalog.getTables()) {
        console.log(table);
      }
      return true;

    default:
      if (cmd.startsWith(".schema")) {
        const [, tableName] = cmd.split(/\s+/);
        if (!tableName) {
          console.log("Usage: .schema <table>");
          return true;
        }

        const table = catalog.getTable(tableName);
        console.log(`${tableName} (`);

        for (const col of table.schema.columns) {
          let line = `  ${col.name} ${col.type}`;
          if (col.maxLength) line += `(${col.maxLength})`;
          if (col.primaryKey) line += " PRIMARY KEY";
          if (col.unique) line += " UNIQUE";
          console.log(line);
        }

        console.log(")");
        return true;
      }
  }

  return false;
}

/**
 * Start REPL
 */
function startRepl({ dbPath }) {
const catalog = new Catalog({ dbPath });
  const storageEngine = new FileStorageEngine(catalog, dbPath);
  const engine = new Engine({ catalog, storageEngine });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "rdbms> "
  });

  console.log("rdbms v0.1");
  console.log("Type .help for help");

  rl.prompt();

  rl.on("line", async (line) => {
    const input = line.trim();

    if (!input) {
      rl.prompt();
      return;
    }

    if (input === ".exit") {
      rl.close();
      return;
    }

    try {
      // Meta commands
      if (input.startsWith(".")) {
        const handled = handleMetaCommand(input, { catalog });
        if (!handled) {
          console.log(`Unknown command: ${input}`);
        }
        rl.prompt();
        return;
      }

      // SQL execution
      const result = await engine.execute(input);

      if (Array.isArray(result)) {
        printRows(result);
      } else {
        console.log("OK");
      }
    } catch (err) {
      console.error("Error:", err.message);
    }

    rl.prompt();
  });

  rl.on("close", () => {
    console.log("Bye 👋");
    process.exit(0);
  });
}

module.exports = { startRepl };
