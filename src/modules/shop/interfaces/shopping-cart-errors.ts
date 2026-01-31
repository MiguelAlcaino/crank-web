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
  | 'FIRST_TIMER_ALREADY_EXISTS'
  | 'NOT_ELIGIBLE_FOR_FIRST_TIMER'
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
  DontNeedMoreGiftCards: 'LIMIT_REACHED',
  UserAlreadyHaveFirstTimerPackage: 'FIRST_TIMER_ALREADY_EXISTS',
  UserCanNotBuyFirstTimerPackage: 'NOT_ELIGIBLE_FOR_FIRST_TIMER'
}

export const ERROR_MESSAGES: Record<string, string> = {
  PRODUCT_NOT_FOUND: 'The selected product is no longer available.',
  CART_EMPTY: 'Your shopping cart is empty.',
  CART_NOT_FOUND: 'No shopping cart found. Please start a new order.',
  ITEM_NOT_FOUND: 'The item was not found in your cart.',
  GIFT_CARD_INVALID: 'This code is not valid for this purchase. Please remove it.',
  GIFT_CARD_ALREADY_USED: 'This gift card has already been added to your cart.',
  GIFT_CARD_NOT_REGISTERED: 'The gift card code provided is not registered.',
  DISCOUNT_CODE_INVALID: 'The discount code is invalid or not applicable.',
  DISCOUNT_CODE_EMPTY: 'Please enter a discount code.',
  LIMIT_REACHED: 'You cannot add more items or gift cards to this order.',
  FIRST_TIMER_ALREADY_EXISTS:
    'You already have a First Timer package. You cannot purchase another one.',
  NOT_ELIGIBLE_FOR_FIRST_TIMER: 'You are not eligible for a First Timer package. Please remove it.',
  UNKNOWN_ERROR: 'An unexpected issue with your cart. Please contact support.'
}
