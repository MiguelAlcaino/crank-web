import { ERROR_UNKNOWN } from '@/utils/errorMessages'
import type { ShoppingCart } from './shopping-cart'

export class EditShoppingCartResponse {
  code:
    | 'ShoppingCart'
    | 'ShoppingCartIsEmpty'
    | 'ShoppingCartItemNotFound'
    | 'ProductNotFound'
    | 'ShoppingCartNotFound'
    | 'UnknownError'

  shoppingCart?: ShoppingCart

  constructor(
    typeName:
      | 'ShoppingCart'
      | 'ShoppingCartIsEmpty'
      | 'ShoppingCartItemNotFound'
      | 'ProductNotFound'
      | 'ShoppingCartNotFound'
      | 'UnknownError',
    shoppingCart?: ShoppingCart
  ) {
    this.code = typeName
    this.shoppingCart = shoppingCart
  }

  get message(): string {
    switch (this.code) {
      case 'ShoppingCart':
        return 'ShoppingCart success.'
      case 'ShoppingCartIsEmpty':
        return 'ShoppingCartIsEmpty error.'
      case 'ShoppingCartItemNotFound':
        return 'ShoppingCartItemNotFound error.'
      case 'ProductNotFound':
        return 'ProductNotFound error.'
      case 'ShoppingCartNotFound':
        return 'ShoppingCartNotFound error.'
      default:
        return ERROR_UNKNOWN
    }
  }

  get success(): boolean {
    return this.code === 'ShoppingCart'
  }
}
