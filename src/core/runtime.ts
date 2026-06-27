/**
 * Runtime identifiers supported by the first Composite milestone.
 */
export type RuntimeKind = "mw" | "mwn" | "mock";

/**
 * Describes the concrete runtime behind a {@link Wiki}.
 */
export interface Runtime {
  /**
   * The runtime implementation kind.
   */
  kind: RuntimeKind;
}
