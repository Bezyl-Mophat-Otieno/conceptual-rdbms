class Operator {
  open() {}
  next() {
    throw new Error("next() not implemented");
  }
  close() {}
}

module.exports = { Operator };
