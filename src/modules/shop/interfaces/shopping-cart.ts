import type { ShoppingCartItem } from './shopping-cart-item'

export interface ShoppingCart {
  id: string
  items: ShoppingCartItem[]
  total?: number | null
  currency: string
  subTotal?: number | null
  giftCardCode?: string | null
  discountCode?: string | null
}
