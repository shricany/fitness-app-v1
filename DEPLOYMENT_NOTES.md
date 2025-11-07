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
