#!/usr/bin/env node
const local = require('./local.test');
const remote = require('./remote.test');

async function main() {
  const arg = process.argv[2] || 'all';
  const runs = [];

  try {
    if (arg === 'local' || arg === 'all') {
      runs.push((async () => { await local.run(); })());
    }

    if (arg === 'remote' || arg === 'all') {
      runs.push((async () => { await remote.run(); })());
    }

    await Promise.all(runs);
    console.log('\nAll selected tests completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('\nTest run failed:', err.message);
    process.exit(2);
  }
}

main();
