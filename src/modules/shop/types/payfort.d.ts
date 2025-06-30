/**
 * @file This file contains global type declarations for third-party scripts,
 * specifically for the IOVation/Payfort device fingerprinting service.
 *
 * By declaring these types globally, we provide TypeScript with awareness
 * of properties attached to the `window` object by external scripts,

 * enabling type safety and IntelliSense across the application.
 */

// This empty export is required to treat this file as a module and allow for global augmentation.
export {}

declare global {
  /**
   * Extends the global `Window` interface to include properties used by
   * the IOVation Snare.js script for device fingerprinting.
   */
  interface Window {
    /**
     * Corresponds to the `io_install_stm` configuration parameter.
     */
    io_install_stm: boolean
    /**
     * Corresponds to the `io_exclude_stm` configuration parameter.
     */
    io_exclude_stm: number
    /**
     * Corresponds to the `io_install_flash` configuration parameter.
     */
    io_install_flash: boolean
    /**
     * Corresponds to the `io_enable_rip` configuration parameter.
     */
    io_enable_rip: boolean
    /**
     * The ID of the hidden input field where the session ID (blackbox) will be stored.
     * Corresponds to the `io_bbout_element_id` configuration parameter.
     */
    io_bbout_element_id: string
  }
}
