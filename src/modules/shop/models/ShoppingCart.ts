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
   * Getter to calculate and format the subtotal from item prices.
   * This is more reliable than using the `subTotal` from the API if you
   * need to recalculate it on the client side for some reason.
   */
  public get calculatedSubtotal(): number {
    return this.items.reduce((acc, item) => {
      // The price is now accessed through the variant
      return acc + item.variant.price * item.quantity
    }, 0)
  }

  /**
   * Returns the calculated subtotal as a formatted string.
   * @returns A string representing the formatted price.
   */
  public getFormattedSubtotal(): string {
    return formatPrice(this.calculatedSubtotal, this.currency)
  }
}
