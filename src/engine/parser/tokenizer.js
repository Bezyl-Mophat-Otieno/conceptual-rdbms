const KEYWORDS = new Set([
  "SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES",
  "JOIN", "ON"
]);

function tokenize(sql) {
  return sql
    .replace(/\(/g, " ( ")
    .replace(/\)/g, " ) ")
    .replace(/,/g, " , ")
    .split(/\s+/)
    .filter(Boolean)
    .map(token => {
      const upper = token.toUpperCase();
      if (KEYWORDS.has(upper)) {
        return { type: "KEYWORD", value: upper };
      }
      if (!isNaN(token)) {
        return { type: "NUMBER", value: Number(token) };
      }
      if (token.startsWith("'")) {
        return { type: "STRING", value: token.slice(1, -1) };
      }
      return { type: "IDENTIFIER", value: token };
    });
}

module.exports = { tokenize };
