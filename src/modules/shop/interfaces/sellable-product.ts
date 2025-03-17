import { ProductAlertBeforePurchasing } from './product-alert-before-purchasing'

export interface SellableProduct {
  id: string
  title: string
  subtitle: string
  buttonText?: string
  price: number
  currency: string
  alertBeforePurchasing?: ProductAlertBeforePurchasing
}
