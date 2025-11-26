/**
 * Utility functions for communicating with Flutter WebView
 */

// Types for Flutter WebView communication
declare global {
  interface Window {
    FlutterChannel?: {
      postMessage: (message: string) => void
    }
  }
}

/**
 * @description Checks if the app is running inside a Flutter WebView.
 * @param {boolean} hasWebviewToken - Whether a webview token is present (fallback detection method)
 * @returns {boolean} True if running in Flutter WebView, false otherwise.
 */
export const isFlutterWebView = (hasWebviewToken: boolean = false): boolean => {
  return window.FlutterChannel !== undefined || hasWebviewToken
}

/**
 * @description Sends a message to Flutter WebView.
 * @param {string} message - The message to send to Flutter.
 */
export const sendMessageToFlutter = (message: string): void => {
  try {
    if (window.FlutterChannel && window.FlutterChannel.postMessage) {
      window.FlutterChannel.postMessage(message)
      console.log(`Message sent to Flutter: ${message}`)
    } else {
      console.log(`Flutter channel not available. Would send: ${message}`)
    }
  } catch (error) {
    console.error('Error sending message to Flutter:', error)
  }
}

/**
 * @description Notifies Flutter about successful payment.
 * @param {boolean} hasWebviewToken - Whether a webview token is present (fallback detection method)
 */
export const notifyPaymentSuccess = (hasWebviewToken: boolean = false): void => {
  if (isFlutterWebView(hasWebviewToken)) {
    sendMessageToFlutter('paymentSuccess')
  }
}

/**
 * @description Notifies Flutter about failed payment.
 * @param {boolean} hasWebviewToken - Whether a webview token is present (fallback detection method)
 */
export const notifyPaymentFailure = (hasWebviewToken: boolean = false): void => {
  if (isFlutterWebView(hasWebviewToken)) {
    sendMessageToFlutter('paymentFailure')
  }
}

/**
 * Flutter WebView message types that can be sent
 */
export enum FlutterMessage {
  PAYMENT_SUCCESS = 'paymentSuccess',
  PAYMENT_FAILURE = 'paymentFailure'
}
