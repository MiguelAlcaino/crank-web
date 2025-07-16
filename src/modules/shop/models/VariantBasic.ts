import type { ProductFromQuery } from '@/modules/shop/models/Product'
import { formatPrice } from '@/modules/shop/utils/shop-utils'

export type VariantFromProductQuery = ProductFromQuery['variants'][number]

export class VariantBasic {
  public readonly id: string
  public readonly name: string | null
  public readonly price: number

  constructor(data: VariantFromProductQuery) {
    this.id = data.id
    this.name = data.name ?? null
    this.price = data.price
  }

  public get formattedPrice(): string {
    return formatPrice(this.price, 'AED')
  }
}
