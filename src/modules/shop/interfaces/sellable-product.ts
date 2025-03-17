import type { ProductAlertBeforePurchasing } from './product-alert-before-purchasing'

export interface SellableProduct {
  id: string
  title: string
  subtitle: string
  buttonText?: string | null
  price: number
  currency: string
  alertBeforePurchasing?: ProductAlertBeforePurchasing | null
}
