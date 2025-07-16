import type { ShoppingCart as GqlShoppingCart } from '@/gql/graphql'
import { ShoppingCartItem } from './ShoppingCartItem'
import { formatPrice } from '@/modules/shop/utils/shop-utils'

/**
 * Represents the user's shopping cart.
 */
export class ShoppingCart {
  public readonly id: string
  public readonly total: number | null
  public readonly subTotal: number | null
  public readonly currency: string
  public readonly giftCardCode: string | null
  public readonly discountCode: string | null
  public readonly items: ShoppingCartItem[]

  constructor(gqlCart: GqlShoppingCart) {
    this.id = gqlCart.id
    this.total = gqlCart.total ?? null
    this.subTotal = gqlCart.subTotal ?? null
    this.currency = gqlCart.currency
    this.giftCardCode = gqlCart.giftCardCode ?? null
    this.discountCode = gqlCart.discountCode ?? null

    this.items = gqlCart.items.map((item) => new ShoppingCartItem(item))
  }

  /**
   * A useful getter to know the number of items in the cart.
   */
  public get itemCount(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0)
  }

  /**
   * A useful getter to quickly check if the cart is empty.
   */
  public get isEmpty(): boolean {
    return this.items.length === 0
  }

  /**
   * Returns the calculated subtotal as a formatted string.
   * @returns A string representing the formatted price.
   */
  public get formattedSubtotal(): string {
    return formatPrice(this.subTotal, this.currency)
  }

  /**
   * Returns the calculated total as a formatted string.
   * @returns A string representing the formatted price.
   */
  public get formattedTotal(): string {
    return formatPrice(this.total, this.currency)
  }
}
