const { ok } = require('./assert');

const DEFAULT_BASE = process.env.BASE_URL || 'http://localhost:3000';

async function fetchText(url) {
  const res = await fetch(url);
  const text = await res.text();
  return { res, text };
}

async function run() {
  const base = DEFAULT_BASE;
  console.log(`Running local tests against ${base}`);

  // Home
  let r = await fetchText(`${base}/`);
  ok(r.res.status === 200, '/ returned non-200');
  ok(r.text.includes('FitnessPro') || r.text.includes('<title>'), 'Home page missing expected content');

  // Modules
  r = await fetchText(`${base}/modules`);
  ok(r.res.status === 200, '/modules returned non-200');
  ok(r.text.includes('Workout Programs') || r.text.includes('Programs'), '/modules missing expected text');

  // Groups
  r = await fetchText(`${base}/groups`);
  ok(r.res.status === 200, '/groups returned non-200');
  ok(r.text.includes('Workout Groups') || r.text.includes('Groups'), '/groups missing expected text');

  // Create session page
  r = await fetchText(`${base}/create-session`);
  ok(r.res.status === 200, '/create-session returned non-200');
  ok(r.text.includes('Create Exercise Session') || r.text.includes('Create Session'), '/create-session missing expected text');

  // Session page (not specific id) - ensure sessions route is available (list or 404 handled)
  r = await fetchText(`${base}/session/123`);
  ok(r.res.status === 200 || r.res.status === 404, '/session/123 returned unexpected status');

  console.log('Local tests passed ✅');
}

module.exports = { run };
