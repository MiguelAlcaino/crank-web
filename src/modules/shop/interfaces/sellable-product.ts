import type { ClassPackageTypeEnum } from './class-package-type-enum'
import type { ProductAlertBeforePurchasing } from './product-alert-before-purchasing'

export interface SellableProduct {
  id: string
  title: string
  subtitle?: string | null
  buttonText?: string | null
  price: number
  currency: string
  type?: ClassPackageTypeEnum | null
  alertBeforePurchasing?: ProductAlertBeforePurchasing | null
}
