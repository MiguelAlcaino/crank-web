import type {
  ProductsQuery,
  ShoppingCart as GqlShoppingCart,
  ShoppingCartItem as GqlShoppingCartItem
} from '@/gql/graphql'
import { createProductModel } from '../factories/productFactory'
import type { Product } from './Product'
import { formatPrice } from '@/modules/shop/utils/shop-utils'

type ProductFromQuery = ProductsQuery['products'][number]

/**
 * Represents a single item within the shopping cart.
 */
export class ShoppingCartItem {
  public readonly id: string
  public readonly quantity: number
  public readonly subtotal: number | null
  public readonly product: Product

  /**
   * Constructs a ShoppingCartItem instance from its GraphQL counterpart.
   * @param gqlItem The raw ShoppingCartItem object received from the GraphQL API.
   */
  constructor(gqlItem: GqlShoppingCartItem) {
    this.id = gqlItem.id
    this.quantity = gqlItem.quantity
    this.subtotal = gqlItem.subtotal ?? null
    this.product = createProductModel(gqlItem.product as unknown as ProductFromQuery)
  }
}

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
      // Ensure product price is available, otherwise treat as 0
      const price = item.product.price || 0
      return acc + price * item.quantity
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
