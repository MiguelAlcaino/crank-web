import type { ShoppingCart as GqlShoppingCart } from '@/gql/graphql'
import { ShoppingCartItem } from './ShoppingCartItem'
import { formatPrice } from '@/modules/shop/utils/shop-utils'

type ShoppingCartTotal = {
  total: number | null
  subTotal: number | null
  giftCardAmount: number | null
  amountToPay: number | null
}

/**
 * Represents the user's shopping cart.
 */
export class ShoppingCart {
  public readonly id: string
  public readonly currency: string
  public readonly discountCode: string | null
  public readonly giftCardsCodes: string[]
  public readonly items: ShoppingCartItem[]

  // The totals are now stored in a nested object.
  // It can be null if the backend returns an error from the union.
  private readonly totals: ShoppingCartTotal | null

  constructor(gqlCart: GqlShoppingCart) {
    this.id = gqlCart.id
    this.currency = gqlCart.currency
    this.discountCode = gqlCart.discountCode ?? null
    this.giftCardsCodes = (gqlCart.giftCardsCodes ?? []).filter((code): code is string =>
      Boolean(code)
    )

    this.items = gqlCart.items.map((item) => new ShoppingCartItem(item))

    // --- NEW LOGIC for handling the total union ---
    if (gqlCart.total?.__typename === 'ShoppingCartTotal') {
      // If the union returned the success object, we populate our totals.
      this.totals = {
        total: gqlCart.total.total ?? 0,
        subTotal: gqlCart.total.subTotal ?? 0,
        giftCardAmount: gqlCart.total.giftCardAmount ?? 0,
        amountToPay: gqlCart.total.amountToPay ?? 0
      }
    } else {
      // If the union returned something else (an error or was null), we set totals to null.
      this.totals = null
    }
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
    return formatPrice(this.totals?.subTotal, this.currency)
  }

  /**
   * Returns the calculated total as a formatted string.
   * @returns A string representing the formatted price.
   */
  public get formattedTotal(): string {
    return formatPrice(this.totals?.amountToPay, this.currency)
  }
}
