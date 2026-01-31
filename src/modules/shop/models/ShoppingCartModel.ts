import type { ShoppingCart as GqlShoppingCart } from '@/gql/graphql'
import { formatPrice } from '@/modules/shop/utils/shop-utils'
import { ShoppingCartItemModel } from './ShoppingCartItemModel'
import { SHOPPING_CART_ERROR_MAP } from '../interfaces/shopping-cart-errors'

type ShoppingCartTotal = {
  total: number | null
  subTotal: number | null
  giftCardAmount: number | null
  amountToPay: number | null
}

/**
 * Represents the user's shopping cart.
 */
export class ShoppingCartModel {
  public readonly id: string
  public readonly currency: string
  public readonly discountCode: string | null
  public readonly giftCardsCodes: string[]
  public readonly items: ShoppingCartItemModel[]
  private readonly totals: ShoppingCartTotal | null

  /**
   * Represents any error preventing the calculation of the cart totals.
   */
  public readonly calculationError: { type: string; code: string } | null

  constructor(gqlCart: GqlShoppingCart) {
    this.id = gqlCart.id
    this.currency = gqlCart.currency
    this.discountCode = gqlCart.discountCode ?? null
    this.giftCardsCodes = (gqlCart.giftCardsCodes ?? []).filter((code): code is string =>
      Boolean(code)
    )

    this.items = (gqlCart.items ?? []).map((item) => new ShoppingCartItemModel(item))

    if (gqlCart.total?.__typename === 'ShoppingCartTotal') {
      this.totals = {
        total: gqlCart.total.total ?? 0,
        subTotal: gqlCart.total.subTotal ?? 0,
        giftCardAmount: gqlCart.total.giftCardAmount ?? 0,
        amountToPay: gqlCart.total.amountToPay ?? 0
      }
      this.calculationError = null
    } else {
      this.totals = null
      // Capture the error details if the total is not of the expected type
      if (gqlCart.total) {
        const type = gqlCart.total.__typename ?? 'Unknown'
        // Use the map to get the standard error code, or fall back to the raw code from the API if available, or UNKNOWN
        const errorCode =
          SHOPPING_CART_ERROR_MAP[type] ?? (gqlCart.total as any).code ?? 'UNKNOWN_ERROR'

        this.calculationError = {
          type: type,
          code: errorCode
        }
      } else {
        this.calculationError = null
      }
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
    if (this.totals?.amountToPay) return formatPrice(this.totals?.amountToPay, this.currency)
    else return '-'
  }

  /**
   * Returns the total amount discounted for gift cards in the formatted format.
   * @returns A string representing the formatted price.
   */
  public get formattedGiftCardAmount(): string {
    if (!this.totals?.giftCardAmount || this.totals.giftCardAmount === 0) {
      return formatPrice(0, this.currency)
    }
    return `-${formatPrice(this.totals.giftCardAmount, this.currency)}`
  }

  /**
   * Return the original total (before gift cards)
   * @returns A string representing the formatted price.
   */
  public get formattedTotalBeforeGiftCards(): string {
    return formatPrice(this.totals?.total, this.currency)
  }

  /**
   * Check if the cart has any gift cards applied
   * @returns A string representing the formatted price.
   */
  public get hasGiftCards(): boolean {
    return this.giftCardsCodes.length > 0
  }
}
