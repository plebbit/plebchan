import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer, loadConfigFromFile } from 'vite';

test('the app Vite configuration compiles LoadingEllipsis with React memo caches', { timeout: 30_000 }, async (t) => {
  const configFile = fileURLToPath(new URL('../../vite.config.js', import.meta.url));
  const root = dirname(configFile);
  const cacheDir = mkdtempSync(join(tmpdir(), '5chan-react-compiler-'));
  const environment = new Map(['VITE_APP_VERSION', 'VITE_COMMIT_REF', 'VITE_LATEST_RELEASE_COMMIT_REF'].map((key) => [key, process.env[key]]));
  let server;
  t.after(async () => {
    await server?.close();
    rmSync(cacheDir, { recursive: true, force: true });
    for (const [key, value] of environment) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  // Keep metadata resolution offline, including shallow CI checkouts without release tags.
  process.env.VITE_COMMIT_REF = 'compiler-test';
  process.env.VITE_LATEST_RELEASE_COMMIT_REF = 'compiler-test';
  const loaded = await loadConfigFromFile({ command: 'serve', mode: 'development' }, configFile, root);
  assert.ok(loaded, `Could not load ${configFile}`);
  server = await createServer({
    ...loaded.config,
    configFile: false,
    root,
    cacheDir,
    server: { ...loaded.config.server, middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
  });

  const sourcePath = '/src/components/loading-ellipsis/loading-ellipsis.tsx';
  t.diagnostic(`Transforming ${sourcePath} with ${configFile}`);
  const transformed = await server.transformRequest(sourcePath);
  assert.ok(transformed, `Vite did not transform ${sourcePath}`);
  assert.match(transformed.code, /compiler-runtime/, 'React Compiler must inject its runtime');
  assert.match(transformed.code, /react\.memo_cache_sentinel/, 'React Compiler must emit memo caches for the component');
});
