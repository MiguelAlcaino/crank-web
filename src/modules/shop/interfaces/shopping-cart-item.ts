import type { SellableProduct } from './sellable-product'

export interface ShoppingCartItem {
  id: string
  product: SellableProduct
  quantity: number
  subtotal?: number | null
}
