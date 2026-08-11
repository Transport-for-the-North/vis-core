# Contributing to vis-core

This file outlines contribution guidelines for vis-core. It's currently a stub, focused mainly on within-project imports.

## Import standards and conventions

Because `vis-core` is compiled by Vite/Rollup into multiple separate chunks (e.g., `Components`, `contexts`, `hooks`), how we import files internally is extremely important. If not done correctly, it can lead to cross-chunk circular dependencies which cause fatal **Temporal Dead Zone (TDZ)** crashes (e.g., `Uncaught ReferenceError`) in production.

### 1. Do NOT use barrel files internally

While `vis-core` exposes master barrel files (like `src/Components/index.js`) for *external* applications to use, you must **never** use them internally within the `vis-core` repository.

Importing from a master barrel file forces the bundler to intertwine chunks, resulting in circular dependencies.

**❌ BAD (causes TDZ crashes):**

```javascript
// Never import from the top-level alias!
import { Dashboard } from "layouts";
import { WarningBox } from "Components";
import { useMapContext } from "hooks";
```

**✅ GOOD (bypasses barrel files):**

```javascript
// Always import directly from the specific folder or file!
import { Dashboard } from "layouts/Dashboard/Dashboard";
import { WarningBox } from "Components/MessageBox/MessageBox";
import { useMapContext } from "hooks/useMapContext";
```

### 2. Use Vite path aliases instead of relative paths

We have configured Vite path aliases (such as `Components`, `hooks`, `contexts`, `layouts`, `utils`, `services`, `reducers`, `defaults`) to make imports cleaner.

Whenever possible, avoid using confusing step-out relative paths (`../../`) and use the aliases instead.

**❌ BAD (messy relative paths):**

```javascript
import { useMapContext } from "../../../hooks/useMapContext";
import { Dimmer } from "../../Dimmer/Dimmer";
```

**✅ GOOD (clean alias paths):**

```javascript
import { useMapContext } from "hooks/useMapContext";
import { Dimmer } from "Components/Dimmer/Dimmer";
```

### 3. Sibling imports

For simple sibling imports within the exact same directory, standard relative imports (`./`) are perfectly fine and encouraged.

```javascript
// Inside src/Components/MapLayout/MapLayout.jsx
import Map from "./Map";
import DualMaps from "./DualMaps";
```

---

## Automated safeguards

To prevent circular dependencies from breaking the build, the repository uses `madge`.

1. **Pre-commit hook**: A local Husky pre-commit hook runs `npm run lint:circular` automatically. If you introduce a circular dependency, your commit will be instantly aborted.
2. **CI pipeline**: The GitHub Actions pipeline runs this exact same check on all pull requests targeting `dev` or `main`. PRs with circular dependencies will be blocked from merging.
