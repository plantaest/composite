import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const repoRoot = new URL('../..', import.meta.url);

describe('import boundaries', () => {
  it('keeps the root import free of runtime implementations', async () => {
    const source = await readSource('src/index.ts');

    expect(source).not.toContain('runtimes/mw');
    expect(source).not.toContain('runtimes/mwn');
    expect(source).not.toContain('mwn');
  });

  it('keeps the mw runtime free of mwn imports', async () => {
    const sources = await readSources('src/runtimes/mw');

    for (const source of sources) {
      expect(source).not.toContain('from "mwn"');
      expect(source).not.toContain("from 'mwn'");
      expect(source).not.toContain('runtimes/mwn');
    }
  });

  it('keeps wikitext utilities free of runtime imports', async () => {
    const sources = await readSources('src/wikitext');

    for (const source of sources) {
      expect(source).not.toContain('runtimes/mw');
      expect(source).not.toContain('runtimes/mwn');
    }
  });
});

async function readSources(path: string): Promise<string[]> {
  const absolutePath = join(repoRoot.pathname, path);
  const entries = await readdir(absolutePath, { withFileTypes: true });
  const sources: string[] = [];

  for (const entry of entries) {
    const childPath = `${path}/${entry.name}`;

    if (entry.isDirectory()) {
      sources.push(...(await readSources(childPath)));
      continue;
    }

    if (entry.name.endsWith('.ts')) {
      sources.push(await readSource(childPath));
    }
  }

  return sources;
}

async function readSource(path: string): Promise<string> {
  return readFile(join(repoRoot.pathname, path), 'utf8');
}
