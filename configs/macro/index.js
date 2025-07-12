/* eslint-disable @typescript-eslint/no-unused-expressions -- used in loggers */
/* eslint-disable @typescript-eslint/no-empty-function -- create empty function to remove dead code */
/* eslint-disable no-restricted-syntax -- macros are not yet injected */
/* eslint-disable no-debugger -- assertions needs debugger */
/* eslint-disable no-console -- console wrappers needs console */
/* global console, alert, process -- used in the code */

/**
 * This script creates macro functions that could be replaced by rsbuild.
 *
 * @see https://rsbuild.dev/config/source/define
 *
 * To use this script, just call "`(${function.toString()}`". Don't forget the
 * parentheses, they make it a correct IIFE to be called.
 */

// #region Constants
export const IS_PROD = JSON.stringify(process.env.NODE_ENV === 'production');
export const IS_DEV = JSON.stringify(process.env.NODE_ENV === 'development');
export const IS_TEST = JSON.stringify(process.env.NODE_ENV === 'test');

// #endregion Constants

// #region Logging

/**
 * MAKE_LOGGER macro implementation.
 *
 * To log certain namespaces and ignore others, change the value of `ENABLED`.
 *
 * @param {string} [namespace="default"] Namespace to distinguish log caller.
 *   Default is `"default"`
 * @returns {{ namespace: string; color: string } | undefined} Undefined if the
 *   namespace is not enabled, logger configuration otherwise.
 */
function makeLoggerEnabled(namespace = 'default') {
  /**
   * Modify this function to enable/disable logging of certain namespaces.
   *
   * @param {string} namespace
   * @returns {boolean}
   */
  const isEnabled = namespace => {
    void namespace;
    return true;
  };

  if (!isEnabled(namespace)) {
    return;
  }

  // Copied from https://github.com/debug-js/debug/blob/bc60914816e5e45a5fff1cd638410438fc317521/src/browser.js#L27
  // eslint-disable-next-line prettier/prettier -- make the function more readable
  const colors = ['#00C', '#00F', '#03C', '#03F', '#06C', '#06F', '#09C', '#09F', '#0C0', '#0C3', '#0C6', '#0C9', '#0CC', '#0CF', '#30C', '#30F', '#33C', '#33F', '#36C', '#36F', '#39C', '#39F', '#3C0', '#3C3', '#3C6', '#3C9', '#3CC', '#3CF', '#60C', '#60F', '#63C', '#63F', '#6C0', '#6C3', '#90C', '#90F', '#93C', '#93F', '#9C0', '#9C3', '#C00', '#C03', '#C06', '#C09', '#C0C', '#C0F', '#C30', '#C33', '#C36', '#C39', '#C3C', '#C3F', '#C60', '#C63', '#C90', '#C93', '#CC0', '#CC3', '#F00', '#F03', '#F06', '#F09', '#F0C', '#F0F', '#F30', '#F33', '#F36', '#F39', '#F3C', '#F3F', '#F60', '#F63', '#F90', '#F93', '#FC0', '#FC3'];

  // Generate a color based on the namespace hash
  let hash = 0;
  for (let index = 0; index < namespace.length; index++) {
    hash = (hash << 5) - hash + namespace.codePointAt(index);
    // eslint-disable-next-line unicorn/prefer-math-trunc -- not equivalent to Math.trunc
    hash |= 0; // Convert to 32bit integer
  }
  const color = colors[Math.abs(hash) % colors.length];

  return { namespace, color };
}

/**
 * DEBUG macro implementation.
 *
 * @param {{ namespace: string; color: string } | undefined} logger
 * @param {unknown} format
 * @param {...unknown[]} messages
 * @returns {void}
 */
function debug(logger, format, ...messages) {
  logger !== undefined &&
    console.debug(
      '%c%s %c' + format,
      'color:' + logger.color,
      logger.namespace,
      'color:none',
      ...messages
    );
}

/**
 * LOG macro implementation.
 *
 * @param {{ namespace: string; color: string } | undefined} logger
 * @param {unknown} format
 * @param {...unknown[]} messages
 * @returns {void}
 */
function log(logger, format, ...messages) {
  logger !== undefined &&
    console.log(
      '%c%s %c' + format,
      'color:' + logger.color,
      logger.namespace,
      'color:none',
      ...messages
    );
}

/**
 * INFO macro implementation.
 *
 * @param {{ namespace: string; color: string } | undefined} logger
 * @param {unknown} format
 * @param {...unknown[]} messages
 * @returns {void}
 */
function info(logger, format, ...messages) {
  logger !== undefined &&
    console.info(
      '%c%s %c' + format,
      'color:' + logger.color,
      logger.namespace,
      'color:none',
      ...messages
    );
}

/**
 * WARN macro implementation.
 *
 * @param {{ namespace: string; color: string } | undefined} logger
 * @param {unknown} format
 * @param {...unknown[]} messages
 * @returns {void}
 */
function warn(logger, format, ...messages) {
  logger !== undefined &&
    console.warn(
      '%c%s %c' + format,
      'color:' + logger.color,
      logger.namespace,
      'color:none',
      ...messages
    );
}

/**
 * ERROR macro implementation.
 *
 * @param {{ namespace: string; color: string } | undefined} logger
 * @param {unknown} format
 * @param {...unknown[]} messages
 * @returns {void}
 */
function error(logger, format, ...messages) {
  logger !== undefined &&
    console.error(
      '%c%s %c' + format,
      'color:' + logger.color,
      logger.namespace,
      'color:none',
      ...messages
    );
}

/**
 * TIME macro implementation.
 *
 * @param {{ namespace: string } | undefined} logger
 * @returns {void}
 */
function time(logger) {
  logger !== undefined && console.time(logger.namespace);
}

/**
 * TIME_LOG macro implementation.
 *
 * @param {{ namespace: string } | undefined} logger
 * @param {...unknown[]} messages
 * @returns {void}
 */
function timeLog(logger, ...messages) {
  logger !== undefined && console.timeLog(logger.namespace, ...messages);
}

/**
 * TIME_END macro implementation.
 *
 * @param {{ namespace: string } | undefined} logger
 * @returns {void}
 */
function timeEnd(logger) {
  logger !== undefined && console.timeEnd(logger.namespace);
}

// #endregion Logging

// #region Assertion

/**
 * ASSERT macro implementation.
 *
 * To enable/disable a breakpoint instead of throwing an error, set
 * `ENABLE_DEBUG` to `true`/`false`. VSCode ctrl/cmd + D may help you modify all
 * of them simultaneously.
 * https://code.visualstudio.com/docs/editor/codebasics#_multiple-selections-multicursor
 *
 * @param {unknown} condition
 * @param {string} [message]
 * @returns {asserts condition}
 */
function assert(condition, message) {
  const ENABLE_DEBUG = true;
  if (!condition) {
    if (ENABLE_DEBUG) {
      (typeof alert === 'function' ? alert : console.log)(
        `ASSERT: The code pauses because an assertion failed. Check call stack for more details. message: ${message}`
      );
      debugger;
    }
    throw new Error(message);
  }
}

/**
 * FAIL macro implementation.
 *
 * To enable/disable a breakpoint instead of throwing an error, set
 * `ENABLE_DEBUG` to `true`/`false`. VSCode ctrl/cmd + D may help you modify all
 * of them simultaneously.
 * https://code.visualstudio.com/docs/editor/codebasics#_multiple-selections-multicursor
 *
 * @param {string} [message]
 * @returns {never}
 */
function fail(message) {
  const ENABLE_DEBUG = true;
  if (ENABLE_DEBUG) {
    (typeof alert === 'function' ? alert : console.log)(
      `FAIL: The code pauses because it should fail. Check call stack for more details. message: ${message}`
    );
    debugger;
  }
  throw new Error(message ?? 'Execution failed');
}

/**
 * NOT_IMPLEMENTED macro implementation.
 *
 * To enable/disable a breakpoint instead of throwing an error, set
 * `ENABLE_DEBUG` to `true`/`false`. VSCode ctrl/cmd + D may help you modify all
 * of them simultaneously.
 * https://code.visualstudio.com/docs/editor/codebasics#_multiple-selections-multicursor
 *
 * @returns {never}
 */
function notImplemented() {
  const ENABLE_DEBUG = true;
  if (ENABLE_DEBUG) {
    (typeof alert === 'function' ? alert : console.log)(
      'NOT_IMPLEMENTED: The code pauses because it is not implemented yet. Check call stack for more details'
    );
    debugger;
  }
  throw new Error('Not implemented yet');
}

/**
 * UNREACHABLE macro implementation.
 *
 * Only use this function in switch statement's default and similar exhaustive
 * if-else blocks. For other cases, use {@link fail}.
 *
 * To enable/disable a breakpoint instead of throwing an error, set
 * `ENABLE_DEBUG` to `true`/`false`. VSCode ctrl/cmd + D may help you modify all
 * of them simultaneously.
 * https://code.visualstudio.com/docs/editor/codebasics#_multiple-selections-multicursor
 *
 * @param {never} value
 * @param {string} [message]
 * @returns {never}
 */
function unreachable(value, message) {
  const ENABLE_DEBUG = true;
  if (ENABLE_DEBUG) {
    (typeof alert === 'function' ? alert : console.log)(
      `UNREACHABLE: The code pauses because it reaches unreachable part. Check call stack for more details. message: ${message}`
    );
    debugger;
  }
  throw new Error(
    `This line should never execute. ${
      message ?? ''
    }.\nContext value:\n${JSON.stringify(value)}`
  );
}

/**
 * DEBUGGER macro implementation.
 *
 * It does not throw an error, but it pauses the code execution, so codes below
 * this line will not be marked as unreachable.
 *
 * To enable/disable a breakpoint, set `ENABLE_DEBUG` to `true`/`false`. VSCode
 * ctrl/cmd + D may help you modify all of them simultaneously.
 * https://code.visualstudio.com/docs/editor/codebasics#_multiple-selections-multicursor
 *
 * @returns {void}
 */
function trigger_debugger() {
  const ENABLE_DEBUG = true;
  if (ENABLE_DEBUG) {
    (typeof alert === 'function' ? alert : console.log)(
      'DEBUGGER: The code pauses because something went wrong. Check call stack for more details.'
    );
    debugger;
  }
}

// #endregion Assertion

export const voidFunction = () => {};

// #region macro strings

/**
 * Create IIFE string from a function.
 *
 * @param {Function} func
 * @returns {string} IIFE function string
 */
function asString(function_) {
  return `(${function_.toString()})`;
}

export const MAKE_LOGGER = asString(makeLoggerEnabled);
export const DEBUG = asString(debug);
export const LOG = asString(log);
export const INFO = asString(info);
export const WARN = asString(warn);
export const ERROR = asString(error);
export const ASSERT = asString(assert);
export const FAIL = asString(fail);
export const TIME = asString(time);
export const TIME_LOG = asString(timeLog);
export const TIME_END = asString(timeEnd);
export const NOT_IMPLEMENTED = asString(notImplemented);
export const UNREACHABLE = asString(unreachable);
export const DEBUGGER = asString(trigger_debugger);
export const VOID_FUNCTION = asString(voidFunction);

// #endregion macro strings

const enableLogging = process.env.NODE_ENV !== 'production';
const enableAssertion = process.env.NODE_ENV !== 'production';

/**
 * @type {import('@rsbuild/core').SourceConfig['define']}
 * @see https://rsbuild.dev/config/source/define
 */
export const define = {
  IS_DEV,
  IS_PROD,
  IS_TEST,
  MAKE_LOGGER: enableLogging ? MAKE_LOGGER : VOID_FUNCTION,
  DEBUG: enableLogging ? DEBUG : VOID_FUNCTION,
  LOG: enableLogging ? LOG : VOID_FUNCTION,
  INFO: enableLogging ? INFO : VOID_FUNCTION,
  WARN: enableLogging ? WARN : VOID_FUNCTION,
  ERROR: enableLogging ? ERROR : VOID_FUNCTION,
  TIME: enableLogging ? TIME : VOID_FUNCTION,
  TIME_LOG: enableLogging ? TIME_LOG : VOID_FUNCTION,
  TIME_END: enableLogging ? TIME_END : VOID_FUNCTION,
  ASSERT: enableAssertion ? ASSERT : VOID_FUNCTION,
  FAIL: enableAssertion ? FAIL : VOID_FUNCTION,
  NOT_IMPLEMENTED: enableAssertion ? NOT_IMPLEMENTED : VOID_FUNCTION,
  UNREACHABLE: enableAssertion ? UNREACHABLE : VOID_FUNCTION,
  DEBUGGER: enableAssertion ? DEBUGGER : VOID_FUNCTION,
};
