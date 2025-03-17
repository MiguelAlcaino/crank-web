import { ShoppingCartItem } from './shopping-cart-item'

export interface ShoppingCart {
  id: string
  quantity: number
  items: ShoppingCartItem[]
  total: number
  currency: string
  subTotal: number
  giftCardCode: string
  discountCode: string
}
