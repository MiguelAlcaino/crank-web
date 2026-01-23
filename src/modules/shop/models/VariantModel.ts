import type { GetShoppingCartQuery } from '@/gql/graphql'
import { ProductBasicModel, type ProductFromCartItem } from './ProductBasicModel'
import { formatPrice } from '@/modules/shop/utils/shop-utils'

export type VariantFromCartItem = NonNullable<
  NonNullable<GetShoppingCartQuery['currentUser']>['shoppingCart']['items']
>[number]['variant']

export class VariantModel {
  public readonly id: string
  public readonly name: string | null
  public readonly price: number
  public readonly product: ProductBasicModel

  /**
   * Constructs a Variant instance.
   * It now requires a reference to its parent Product object.
   * @param data The raw Variant data from GraphQL.
   */
  constructor(data: VariantFromCartItem) {
    this.id = data.id
    this.name = data.name ?? null
    this.price = data.price
    this.product = new ProductBasicModel(data.product as ProductFromCartItem)
  }

  public getFormattedPrice(locale: string = 'en-AE'): string {
    return formatPrice(this.price, this.product.currency, locale)
  }
}
