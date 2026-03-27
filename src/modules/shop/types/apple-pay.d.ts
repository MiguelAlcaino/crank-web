/**
 * @file Global type declarations for the Apple Pay JS API.
 *
 * These declarations provide TypeScript awareness of the ApplePaySession class
 * available in Safari browsers for processing Apple Pay payments.
 */

export {}

declare global {
  interface Window {
    ApplePaySession?: typeof ApplePaySession
  }

  interface ApplePayLineItem {
    label: string
    amount: number
    type?: 'final' | 'pending'
  }

  interface ApplePayPaymentRequest {
    currencyCode: string
    countryCode: string
    lineItems?: ApplePayLineItem[]
    total: ApplePayLineItem
    supportedNetworks: string[]
    merchantCapabilities: string[]
  }

  interface ApplePayValidateMerchantEvent {
    validationURL: string
  }

  interface ApplePayPaymentAuthorizedEvent {
    payment: {
      token: unknown
      shippingContact?: unknown
    }
  }

  class ApplePaySession {
    static readonly STATUS_SUCCESS: number
    static readonly STATUS_FAILURE: number

    constructor(version: number, paymentRequest: ApplePayPaymentRequest)

    begin(): void
    completeMerchantValidation(merchantSession: unknown): void
    completeShippingContactSelection(
      status: number,
      newShippingMethods: unknown,
      newTotal: ApplePayLineItem,
      newLineItems: ApplePayLineItem[]
    ): void
    completeShippingMethodSelection(
      status: number,
      newTotal: ApplePayLineItem,
      newLineItems: ApplePayLineItem[]
    ): void
    completePaymentMethodSelection(
      newTotal: ApplePayLineItem,
      newLineItems: ApplePayLineItem[]
    ): void
    completePayment(status: number): void

    onvalidatemerchant: ((event: ApplePayValidateMerchantEvent) => void) | null
    onshippingcontactselected: ((event: unknown) => void) | null
    onshippingmethodselected: ((event: unknown) => void) | null
    onpaymentmethodselected: ((event: unknown) => void) | null
    onpaymentauthorized: ((event: ApplePayPaymentAuthorizedEvent) => void) | null
    oncancel: ((event: unknown) => void) | null
  }
}
