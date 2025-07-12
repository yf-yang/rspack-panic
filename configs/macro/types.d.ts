/**
 * For more details, check `@whatever/macros` package's `index.js`.
 */

// #region Constants
declare const IS_PROD: boolean;
declare const IS_DEV: boolean;
declare const IS_TEST: boolean;

// #endregion Constants

// #region Logging

declare type Logger = { namespace: string; color: string } | undefined;

/**
 * Create a logger with the namespace. The logger is to be used in `DEBUG`,
 * `LOG`, `INFO`, `WARN`, and `ERROR` functions.
 *
 * This is a macro function that will be removed in the production build. The
 * implementation is in `@whatever/macros` package's `index.js`
 *
 * @param namespace The namespace of the logger.
 */
declare const MAKE_LOGGER: (namespace?: string) => Logger | undefined;

/**
 * Call `console.debug` with the logger namespace.
 *
 * This is a macro function that will be removed in the production build. The
 * implementation is in `@whatever/macros` package's `index.js`
 *
 * @param logger The logger created by calling `MAKE_LOGGER`.
 * @param format The format string. Check
 *   https://developer.chrome.com/docs/devtools/console/format-style#format for
 *   more details.
 * @param messages The messages to log.
 */
declare const DEBUG: (
  logger: Logger,
  format: unknown,
  ...messages: unknown[]
) => void;

/**
 * Call `console.log` with the logger namespace.
 *
 * This is a macro function that will be removed in the production build. The
 * implementation is in `@whatever/macros` package's `index.js`
 *
 * @param logger The logger created by calling `MAKE_LOGGER`.
 * @param format The format string. Check
 *   https://developer.chrome.com/docs/devtools/console/format-style#format for
 *   more details.
 * @param messages The messages to log.
 */
declare const LOG: (
  logger: Logger,
  format: unknown,
  ...messages: unknown[]
) => void;

/**
 * Call `console.info` with the logger namespace.
 *
 * This is a macro function that will be removed in the production build. The
 * implementation is in `@whatever/macros` package's `index.js`
 *
 * @param logger The logger created by calling `MAKE_LOGGER`.
 * @param format The format string. Check
 *   https://developer.chrome.com/docs/devtools/console/format-style#format for
 *   more details.
 * @param messages The messages to log.
 */
declare const INFO: (
  logger: Logger,
  format: unknown,
  ...messages: unknown[]
) => void;

/**
 * Call `console.warn` with the logger namespace.
 *
 * This is a macro function that will be removed in the production build. The
 * implementation is in `@whatever/macros` package's `index.js`
 *
 * @param logger The logger created by calling `MAKE_LOGGER`.
 * @param format The format string. Check
 *   https://developer.chrome.com/docs/devtools/console/format-style#format for
 *   more details.
 * @param messages The messages to log.
 */
declare const WARN: (
  logger: Logger,
  format: unknown,
  ...messages: unknown[]
) => void;

/**
 * Call `console.error` with the logger namespace.
 *
 * This is a macro function that will be removed in the production build. The
 * implementation is in `@whatever/macros` package's `index.js`
 *
 * @param logger The logger created by calling `MAKE_LOGGER`.
 * @param format The format string. Check
 *   https://developer.chrome.com/docs/devtools/console/format-style#format for
 *   more details.
 * @param messages The messages to log.
 */
declare const ERROR: (
  logger: Logger,
  format: unknown,
  ...messages: unknown[]
) => void;

/**
 * Call `console.time` with the logger namespace as label. Color and format are
 * not supported in this function.
 *
 * This is a macro function that will be removed in the production build. The
 * implementation is in `@whatever/macros` package's `index.js`
 *
 * @param logger The logger created by calling `MAKE_LOGGER`.
 */
declare const TIME: (logger: Logger, label: string) => void;

/**
 * Call `console.timeLog` with the logger namespace as label. Color and format
 * are not supported in this function.
 *
 * This is a macro function that will be removed in the production build. The
 * implementation is in `@whatever/macros` package's `index.js`
 *
 * @param logger The logger created by calling `MAKE_LOGGER`.
 * @param messages The messages to log.
 */
declare const TIME_LOG: (logger: Logger, ...messages: unknown[]) => void;

/**
 * Call `console.timeEnd` with the logger namespace as label. Color and format
 * are not supported in this function.
 *
 * This is a macro function that will be removed in the production build. The
 * implementation is in `@whatever/macros` package's `index.js`
 *
 * @param logger The logger created by calling `MAKE_LOGGER`.
 */
declare const TIME_END: (logger: Logger) => void;

// #endregion Logging

// #region Assertion

/**
 * Asserts that the `Bool(condition)` is `true`. If it is `false`, it will throw
 * an error with the message.
 *
 * This is a macro function that will be removed in the production build. The
 * implementation is in `@whatever/macros` package's `index.js`
 *
 * @param condition The condition to check.
 * @param message The message to show when the condition is `false`.
 */
declare const ASSERT: (
  condition: unknown,
  message?: string
) => asserts condition;

/**
 * Fail the code execution with the message.
 *
 * This is a macro function that will be removed in the production build. The
 * implementation is in `@whatever/macros` package's `index.js`
 *
 * @param message The message to show when the code execution fails.
 */
declare const FAIL: (message?: string) => never;

/**
 * Marks the code as not implemented. If the code execution reaches this line,
 * it will throw an error.
 *
 * This is a macro function that will be removed in the production build. The
 * implementation is in `@whatever/macros` package's `index.js`
 */
declare const NOT_IMPLEMENTED: () => never;

/**
 * Marks the code as unreachable. If the code execution reaches this line, it
 * will throw an error.
 *
 * Difference between `UNREACHABLE` and `FAIL` is that `UNREACHABLE` is used for
 * `switch` statements or `if` statements that should cover all the cases.
 *
 * This is a macro function that will be removed in the production build. The
 * implementation is in `@whatever/macros` package's `index.js`
 *
 * @param value The value that is unreachable.
 * @param message The message to show when the code execution reaches this line.
 */
declare const UNREACHABLE: (value: never, message?: string) => never;

/**
 * It does not throw an error, but it pauses the code execution, so codes below
 * this line will not be marked as unreachable.
 *
 * This is a macro function that will be removed in the production build. The
 * implementation is in `@whatever/macros` package's `index.js`
 */
declare const DEBUGGER: () => void;
/**
 * For more details, check `@whatever/macros` package's `index.js`.
 */

// #endregion Assertion
