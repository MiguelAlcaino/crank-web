import type { SellableProduct } from '@/modules/shop/interfaces/sellable-product'
import type { ClassPackageTypeEnum } from '@/modules/shop/interfaces/class-package-type-enum'

export interface SessionsProduct {
  type: ClassPackageTypeEnum
  title: string
  products: SellableProduct[]
}
