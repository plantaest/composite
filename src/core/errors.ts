/**
 * Base error for failures raised by Composite itself.
 */
export class CompositeError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = new.target.name;
  }
}

/**
 * Raised when a Composite factory receives invalid configuration.
 */
export class ConfigurationError extends CompositeError {}

export interface UnsupportedRuntimeErrorOptions {
  api: string;
  runtime: string;
}

/**
 * Raised when an API is not supported by the active runtime.
 */
export class UnsupportedRuntimeError extends CompositeError {
  readonly api: string;
  readonly runtime: string;

  constructor(options: UnsupportedRuntimeErrorOptions) {
    super(`${options.api} is not supported in the ${options.runtime} runtime.`);
    this.api = options.api;
    this.runtime = options.runtime;
  }
}

/**
 * Raised by intentionally unimplemented first-milestone placeholders.
 */
export class NotImplementedError extends CompositeError {}
