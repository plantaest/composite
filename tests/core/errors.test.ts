import {
  CompositeError,
  ConfigurationError,
  UnsupportedRuntimeError,
} from '../../src/index.js';

describe('core errors', () => {
  it('sets CompositeError names to the concrete class', () => {
    const error = new CompositeError('Failed');

    expect(error.name).toBe('CompositeError');
    expect(error.message).toBe('Failed');
  });

  it('describes unsupported runtime failures', () => {
    const error = new UnsupportedRuntimeError({
      api: 'wiki.download',
      runtime: 'mw',
    });

    expect(error.api).toBe('wiki.download');
    expect(error.runtime).toBe('mw');
    expect(error.message).toBe(
      'wiki.download is not supported in the mw runtime.',
    );
  });

  it('sets ConfigurationError names', () => {
    const error = new ConfigurationError('Invalid config');

    expect(error.name).toBe('ConfigurationError');
    expect(error.message).toBe('Invalid config');
  });
});
