function ok(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function equals(a, b, message) {
  if (a !== b) throw new Error(message || `Expected ${a} to equal ${b}`);
}

module.exports = { ok, equals };
