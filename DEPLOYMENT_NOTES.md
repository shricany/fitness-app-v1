Framer Motion / React peer dependency conflict
============================================

Problem
-------
Vercel build failed with an npm ERESOLVE peer dependency error involving `framer-motion` and `react`:

- `framer-motion@10.18.0` (pulled by `framer-motion@^10.16.16` in package.json) has a peerOptional of `react@^18.0.0`.
- The project currently uses `react@19.1.0` which can cause npm's resolver to detect a conflicting peer dependency.

Quick workaround applied
------------------------
Added a root `.npmrc` with:

```
legacy-peer-deps=true
```

This tells npm to ignore peer dependency conflicts during install (equivalent to `npm install --legacy-peer-deps`) which resolves the Vercel build error quickly.

Recommended long-term fixes
---------------------------
1. Align package versions: either downgrade React to a version compatible with all peers (e.g., React 18.x) or upgrade `framer-motion` to a release that officially supports React 19 (if available).
2. Prefer pinning `framer-motion` to a version compatible with your chosen React major version.
3. Remove `.npmrc` and test `npm ci`/clean installs in CI once dependencies are aligned.

Notes
-----
- Using `legacy-peer-deps` is safe as a short-term workaround, but may hide real compatibility issues. Test the UI and runtime behavior thoroughly, especially animation-related parts that use `framer-motion`.
- If you choose to downgrade React to 18.x, also update `@types/react` and any other libs that list react 19 as a peer.
Additional changes made
----------------------
- Added a visible "Create Session" CTA in the main navigation (desktop + mobile) to make the session creation page discoverable.
- Added contextual "Create Session" CTAs on the Dashboard and Groups pages.
- Added a Cypress E2E test scaffold (`cypress/e2e/create_session.cy.ts`) and npm scripts (`cy:open`, `cy:run`, `test:e2e`) to help validate the create-session flow in CI or locally.

Notes about the E2E test
------------------------
- The Cypress test is a lightweight smoke test that asserts the create-session page renders and the basic form fields exist. To run it locally:

```bash
# start the dev server in one terminal
npm run dev

# in another terminal, open Cypress
npm run cy:open
```

Or run headless:

```bash
npm run test:e2e
```

You will need to `npm install` devDependencies (Cypress) before running tests.
