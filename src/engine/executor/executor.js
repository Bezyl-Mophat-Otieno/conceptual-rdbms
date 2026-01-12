class Executor {
  execute(plan) {
    plan.open();
    const results = [];
    let row;
    while ((row = plan.next())) {
      results.push(row);
    }
    plan.close();
    return results;
  }
}

module.exports = { Executor };
