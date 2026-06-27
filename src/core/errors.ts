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
 * Raised when an API is not supported by the active runtime.
 */
export class UnsupportedRuntimeError extends CompositeError {}

/**
 * Raised by intentionally unimplemented first-milestone placeholders.
 */
export class NotImplementedError extends CompositeError {}
