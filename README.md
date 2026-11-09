# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
## Team roles (simulated)

| Account        | Role | Opens PRs | Approves PRs | Triggers | Approves |
|----------------| --- | --- | --- | --- | --- |
| @SamikshaPatel | Devs, release manager | Yes | — | Deploy to QA, promote to staging | Prod (gate 2) |
| @Samiksha235   | Reviewer, QA lead | Automation PRs | Yes (CODEOWNERS) | Promote to prod after UAT | Staging (gate 1) |

## Environments

| Environment | URL | Approval |
| --- | --- | --- |
| DEV | https://calc-release-lab-dev.pages.dev | None (auto on merge to develop) |
| QA | https://calc-release-lab-qa.pages.dev | None (deploy on demand) |
| STAGING / UAT | https://calc-release-lab-staging.pages.dev | Gate 1: QA lead |
| PROD | https://calc-release-lab-prod.pages.dev | Gate 2: release manager |


**Merge rule:** the PR author merges after approval. Only the release manager merges into `main`.

## Release process

1. QA signs off the build in QA; release manager cuts `release/x.y` from that commit and tags `vx.y.0-rc.1`.
2. Promote to Staging (gate 1, QA lead approves) → UAT.
3. UAT defect: fix by PR into `release/x.y` → builds `x.y.0-rc.N` → Deploy to QA with branch `release/x.y` → retest → tag `vx.y.0-rc.N` → promote again.
4. Promote to Prod (gate 2, release manager approves) → publish `vx.y.0`.
5. Back-merge `release/x.y` into `develop` by PR; merge into `main`.
