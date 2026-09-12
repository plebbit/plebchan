# Measure the affected flow

Use the task's URL, selected browser, real routes/content, and owned session. For a loading or interaction performance issue, include a Chromium low-spec pass with `./scripts/pw-throttle.sh <session> mid` (or the assigned profile). Apply it before measurement; Firefox/WebKit do not support this CDP helper. Record viewport, browser, throttle, cache state, dev/production build, and capture overhead so before/after samples are comparable.

## Browser evidence

Use existing evidence first. When timings alone cannot identify the affected phase, this small observer can be loaded before the app. Open `about:blank` with the wrapper, then run the function below through `playwright-cli -s=<session> run-code --filename=<task-owned-file>`. It needs a new document load to take effect; a hash-only transition does not run init scripts again.

```javascript
async page => {
  await page.addInitScript(() => {
    window.__PROFILING__ = true;
    window.__PROFILE__ = { longTasks: [], shifts: [], lcp: null, supported: [] };
    const observe = (type, collect) => {
      if (!PerformanceObserver.supportedEntryTypes.includes(type)) return;
      window.__PROFILE__.supported.push(type);
      new PerformanceObserver(list => list.getEntries().forEach(collect)).observe({ type, buffered: true });
    };
    observe("longtask", e => window.__PROFILE__.longTasks.push({ start: e.startTime, duration: e.duration }));
    observe("layout-shift", e => {
      if (!e.hadRecentInput) window.__PROFILE__.shifts.push({ start: e.startTime, value: e.value });
    });
    observe("largest-contentful-paint", e => { window.__PROFILE__.lcp = e.startTime; });
  });
}
```

`__PROFILING__` suppresses the app's react-scan toolbar. Preserve the installed React DevTools hook; do not replace or wrap it merely to count commits. Unsupported observer types are unavailable measurements, not zero values.

- **Document load:** navigate to the full hash URL, explicitly reloading if the preceding navigation changed only the hash. Read `performance.getEntriesByType("navigation")` and measure when the actual feed/control becomes ready. The document load event can finish before peer content arrives; a reload is not automatically a cold-cache test.
- **Hash transition or interaction:** mark phase start, perform the action, wait for its observable completion, then mark phase end in the same document. Put those operations in one `run-code` invocation to avoid including idle time between CLI calls. Do not compare marks across reloads.
- **Scroll or repeated interaction:** capture phase start/end timestamps and filter long tasks/shifts to that interval. Hash routing retains counters; do not sum cumulative data again for each route. Collect results before a document reload discards them.

```bash
playwright-cli -s=profile-task eval '() => performance.getEntriesByType("navigation").map(n => ({ loadMs: n.loadEventEnd, domMs: n.domContentLoadedEventEnd }))'
playwright-cli -s=profile-task eval '() => window.__PROFILE__'
playwright-cli -s=profile-task console error
```

Raw layout-shift events, even with recent-input events excluded, are not the complete CLS session-window calculation. LCP describes a document load, not each hash navigation. Long tasks show main-thread stalls without identifying their cause. Treat all counts and thresholds as triage evidence; establish measured cost before recommending memoization or refactoring.

Use a [Playwright trace](../../playwright-cli/references/tracing.md) to correlate actions with requests/DOM state when useful; it is not a CPU sampling profile. Record missing peer content, dynamic tooling readiness, background activity, and instrumentation overhead as limitations.

## 5chan React evidence

In a dev build, `src/lib/react-scan.ts` aggregates react-scan `onRender` events by component name. `window.__getReactScanReport()` returns `{ ComponentName: { count, time } }`; `window.__resetReactScanReport()` clears it between phases. These functions arrive through a dynamic import. If absent, wait for readiness within a bounded check; if still unavailable, report that limit.

```bash
playwright-cli -s=profile-task eval '() => typeof window.__getReactScanReport === "function" ? window.__getReactScanReport() : null'
playwright-cli -s=profile-task eval '() => window.__resetReactScanReport?.()'
```

Capture a phase's report before resetting or reloading. Reset just before the next measured action, or calculate deltas when retaining a cumulative report. Counts are aggregated across instances sharing a name, timing comes from react-scan, and early renders can precede collector readiness. Neither counts nor missing timing establish the user's observed latency by themselves.

Do not substitute react-scan's raw `getReport()` for this collector. To resolve a specific visible component to source, use the `inspect-elements` skill and its `__ELEMENT_SOURCE__` helper; a display name alone is not an exact source location.
