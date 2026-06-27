import { WikiRegistry } from '../../src/index.js';
import { createMockWiki } from '../../src/testing/index.js';

describe('WikiRegistry', () => {
  it('stores multiple wiki instances by id', () => {
    const testwiki = createMockWiki();
    const commonswiki = createMockWiki();
    const wikis = new WikiRegistry({
      commonswiki,
      testwiki,
    });

    expect(wikis.ids()).toEqual(['commonswiki', 'testwiki']);
    expect(wikis.has('testwiki')).toBe(true);
    expect(wikis.get('commonswiki')).toBe(commonswiki);
    expect(wikis.get('testwiki')).toBe(testwiki);
  });

  it('fails when a wiki id is unknown', () => {
    const wikis = new WikiRegistry({
      testwiki: createMockWiki(),
    });

    expect(() => wikis.get('missing')).toThrow('Unknown wiki: missing');
  });

  it('fails when no wikis are provided', () => {
    expect(() => new WikiRegistry({})).toThrow(
      'At least one wiki is required.',
    );
  });
});
