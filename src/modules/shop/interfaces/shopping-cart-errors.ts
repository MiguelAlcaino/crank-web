export type ShoppingCartBusinessError =
  | 'PRODUCT_NOT_FOUND'
  | 'CART_EMPTY'
  | 'CART_NOT_FOUND'
  | 'ITEM_NOT_FOUND'
  | 'GIFT_CARD_INVALID'
  | 'GIFT_CARD_ALREADY_USED'
  | 'GIFT_CARD_NOT_REGISTERED'
  | 'DISCOUNT_CODE_INVALID'
  | 'DISCOUNT_CODE_EMPTY'
  | 'LIMIT_REACHED'
  | 'UNKNOWN_ERROR'

/**
 * Map the __typenames that GraphQL returns to our constant error types.
 */
export const SHOPPING_CART_ERROR_MAP: Record<string, ShoppingCartBusinessError> = {
  ProductNotFound: 'PRODUCT_NOT_FOUND',
  ShoppingCartIsEmpty: 'CART_EMPTY',
  ShoppingCartNotFound: 'CART_NOT_FOUND',
  ShoppingCartItemNotFound: 'ITEM_NOT_FOUND',
  GiftCardIsNotUsable: 'GIFT_CARD_INVALID',
  GiftCardAlreadyRegisteredForCurrentShoppingCart: 'GIFT_CARD_ALREADY_USED',
  GiftCardNotRegisteredOnCurrentShoppingCart: 'GIFT_CARD_NOT_REGISTERED',
  DiscountCodeIsInvalid: 'DISCOUNT_CODE_INVALID',
  DiscountCodeIsEmpty: 'DISCOUNT_CODE_EMPTY',
  DontNeedMoreGiftCards: 'LIMIT_REACHED'
}
