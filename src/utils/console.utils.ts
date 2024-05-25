/**
 * A collection of static utility functions for working with nodejs processes.
 *
 * @export
 * @class ProcessConsoleUtils
 */
export default class ProcessConsoleUtils {
  /**
   * * console log incoming information
   *
   * @static
   * @param {unknown} information : information to console log
   * @returns {void}
   * @memberof ProcessConsoleUtils
   */
  static consoleLog(information: unknown): void {
    console.log(information);
  }

  /**
   * * console error incoming information
   *
   * @static
   * @param {unknown} information : information to console log
   * @returns {void}
   * @memberof ProcessConsoleUtils
   */
  static consoleError(information: unknown): void {
    console.error(information);
  }

  /**
   * * exit the current process
   *
   * @static
   * @returns {void}
   * @memberof ProcessConsoleUtils
   */
  static processExit(): void {
    process.exit(1);
  }
}
