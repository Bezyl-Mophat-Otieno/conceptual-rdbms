function compilePredicate(predicate) {
  const { left, operator, right } = predicate;

  const opFn = getOperatorFn(operator);

  // Column = Literal  (WHERE clause)
  if (isLiteral(right)) {
    const columnName = left.column;
    const literalValue = right.value;

    return (row) => {
      const value = row.get(columnName);
      return opFn(value, literalValue);
    };
  }

  // Column = Column  (JOIN clause)
  const leftColumn = left.column;
  const rightColumn = right.column;

  return (leftRow, rightRow) => {
    const leftValue = leftRow.get(leftColumn);
    const rightValue = rightRow.get(rightColumn);
    return opFn(leftValue, rightValue);
  };
}

// ---- helpers ----

function getOperatorFn(operator) {
  switch (operator) {
    case "=": return (a, b) => a === b;
    case "!=": return (a, b) => a !== b;
    case "<": return (a, b) => a < b;
    case "<=": return (a, b) => a <= b;
    case ">": return (a, b) => a > b;
    case ">=": return (a, b) => a >= b;
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

function isLiteral(node) {
  return node && node.value !== "undefined";
}

module.exports = { compilePredicate };
