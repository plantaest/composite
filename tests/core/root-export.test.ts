import * as Core from '../../src/index.js';

describe('root import', () => {
  it('does not expose runtime factories', () => {
    expect('Composite' in Core).toBe(false);
  });

  it('exposes core errors', () => {
    expect(Core.CompositeError).toBeTypeOf('function');
    expect(Core.UnsupportedRuntimeError).toBeTypeOf('function');
  });
});
