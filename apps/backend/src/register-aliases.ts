import Module from 'module';
import path from 'path';

// Minimal runtime alias resolver so imports like `@config` work in compiled dist
// Use any to access Node internal fields without compiler errors.
const originalResolve = (Module as any)._resolveFilename as any;

(Module as any)._resolveFilename = function(request: string, parent: any, isMain: boolean, options: any) {
  if (request === '@config') {
    // __dirname at runtime (in dist) will be dist, so resolve to dist/config if compiled
    // If running from src with ts-node, point to src/config
    const tryPaths = [path.join(__dirname, 'config', 'index.js'), path.join(__dirname, '..', 'src', 'config', 'index.ts')];
    for (const p of tryPaths) {
      try {
        return originalResolve.call(this, p, parent, isMain, options);
      } catch (e) {
        // ignore and try next
      }
    }
  }

  if (request === '@') {
    // map '@' to project src or dist root
    const tryPaths = [path.join(__dirname), path.join(__dirname, '..', 'src')];
    for (const p of tryPaths) {
      try {
        return originalResolve.call(this, p, parent, isMain, options);
      } catch (e) {}
    }
  }

  return originalResolve.call(this, request, parent, isMain, options);
};

export {};
