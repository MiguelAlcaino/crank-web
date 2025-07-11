import type { ShoppingCartItem as GqlShoppingCartItem } from '@/gql/graphql'
import { formatPrice } from '@/modules/shop/utils/shop-utils'
import { Variant, type VariantFromCartItem } from '@/modules/shop/models/Variant'

/**
 * Represents a single item within the shopping cart.
 */
export class ShoppingCartItem {
  public readonly id: string
  public readonly quantity: number
  public readonly subtotal: number | null // This is the subtotal calculated by the server
  public readonly variant: Variant

  /**
   * Constructs a ShoppingCartItem instance from its GraphQL counterpart.
   * @param gqlItem The raw ShoppingCartItem object received from the GraphQL API.
   */
  constructor(gqlItem: GqlShoppingCartItem) {
    this.id = gqlItem.id
    this.quantity = gqlItem.quantity
    this.subtotal = gqlItem.subtotal ?? null

    this.variant = new Variant(gqlItem.variant as unknown as VariantFromCartItem)
  }

  /**
   * Getter to calculate the total price for this line item on the client-side.
   * @returns The total price (variant.price * quantity).
   */
  public get lineItemTotal(): number {
    return this.variant.price * this.quantity
  }

  /**
   * Returns the total for this line item as a formatted string.
   * @returns A string representing the formatted price.
   */
  public getFormattedLineItemTotal(): string {
    return formatPrice(this.lineItemTotal, this.variant.product.currency)
  }
}
