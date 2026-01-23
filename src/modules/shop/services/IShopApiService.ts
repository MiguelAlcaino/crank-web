import type { SiteEnum } from '@/modules/shared/interfaces/site.enum'
import type { ProductModel } from '../models/ProductModel'
import type { ShoppingCartModel as ShoppingCartModel } from '../models/ShoppingCartModel'
import type { CartSummary } from '@/modules/shop/interfaces/cart-summary'
import type { PayfortFormInput, PaymentTransactionStatusEnum } from '@/gql/graphql'
import type { AppProductType } from '@/modules/shop/models/types'

export interface IShopApiService {
  /**
   * Fetches sellable products for a given site from the API and transforms them
   * into rich domain models.
   *
   * @param site The site enum to fetch products for.
   * @param options Optional filters to apply to the product query.
   * @param options.type Filters products by a specific type (e.g., ClassPackage or GiftCard).
   * @returns A promise that resolves to an array of `Product` domain models.
   *          Throws an `ApiError` if the fetch fails.
   */
  getProducts(site: SiteEnum, options?: { type?: AppProductType }): Promise<ProductModel[]>

  /**
   * Adds an item to the user's shopping cart.
   * On success, it returns a new instance of the domain ShoppingCartModel.
   * On failure, it throws an ApiError for business logic errors or a generic Error for network issues.
   *
   * @param site The site where the purchase is being made.
   * @param variantId The ID of the product to add.
   * @param quantity The number of items to add.
   * @returns A Promise that resolves with the updated ShoppingCartModel instance.
   */
  addItemToShoppingCart(
    site: SiteEnum,
    variantId: string,
    quantity: number
  ): Promise<ShoppingCartModel>

  /**
   * Removes an item from the user's shopping cart.
   * On success, it returns the updated ShoppingCartModel instance.
   * On failure, it throws an ApiError for business logic errors or a generic Error for network issues.
   *
   * @param site The site where the cart exists.
   * @param shoppingCartItemId The ID of the cart item to remove.
   * @returns A Promise that resolves with the updated ShoppingCartModel instance.
   */
  removeItemFromShoppingCart(site: SiteEnum, shoppingCartItemId: string): Promise<ShoppingCartModel>

  /**
   * Updates the quantity of an item in the user's shopping cart.
   * On success, it returns the updated ShoppingCartModel instance.
   * On failure, it throws an ApiError for business logic errors or a generic Error for network issues.
   *
   * @param site The site where the cart exists.
   * @param sellableProductId The ID of the product to update.
   * @param quantity The new quantity for the item.
   * @returns A Promise that resolves with the updated ShoppingCartModel instance.
   */
  updateItemInShoppingCart(
    site: SiteEnum,
    sellableProductId: string,
    quantity: number
  ): Promise<ShoppingCartModel>

  /**
   * Applies a discount code to the user's shopping cart.
   * On success, it returns the updated ShoppingCartModel instance with recalculated totals.
   * On failure, it throws an ApiError with a specific code.
   *
   * @param site The site where the cart exists.
   * @param discountCode The discount code string to apply.
   * @returns A Promise that resolves with the updated ShoppingCartModel instance.
   */
  addDiscountCodeToShoppingCart(site: SiteEnum, discountCode: string): Promise<ShoppingCartModel>

  /**
   * Removes the currently applied discount code from the shopping cart.
   * On success, it returns the updated ShoppingCartModel instance with recalculated totals.
   * On failure, it throws an ApiError.
   *
   * @param site The site where the cart exists.
   * @returns A Promise that resolves with the updated ShoppingCartModel instance.
   */
  removeDiscountCode(site: SiteEnum): Promise<ShoppingCartModel>

  /**
   * Fetches the current user's shopping cart for a specific site.
   *
   * @param site The site for which to fetch the cart.
   * @returns A promise that resolves to a `ShoppingCart` model instance,
   *          or `null` if the user has no cart or an error occurs.
   */
  getCartDetails(site: SiteEnum): Promise<ShoppingCartModel | null>

  /**
   * Fetches a lightweight summary of the current user's shopping cart.
   * Designed for efficient display in UI elements like the shopping bag icon, where
   * full totals and detailed calculations are not required. This avoids unnecessary backend overhead.
   * @param site The site for which to fetch the cart summary.
   * @returns A promise that resolves with a CartSummary object, or `null` if no cart exists or an error occurs.
   */
  getCartSummary(site: SiteEnum): Promise<CartSummary | null>

  /**
   * Removes all items from the user's shopping cart.
   * On success, it returns the updated (and now empty) ShoppingCartModel instance.
   * On failure, it throws an ApiError.
   *
   * @param site The site where the cart exists.
   * @returns A Promise that resolves with the empty ShoppingCartModel instance.
   */
  clearShoppingCart(site: SiteEnum): Promise<ShoppingCartModel>

  /**
   * Generates a unique merchant reference ID required for a payment transaction.
   * @param site The site for which to generate the reference.
   * @returns A Promise that resolves with the unique merchant reference string.
   * @throws An ApiError or Error if the operation fails.
   */
  generateMerchantReference(site: SiteEnum): Promise<string>

  /**
   * Generates the HTML payment form from the Payfort payment gateway.
   * @param site The site for which the payment is being made.
   * @param input The necessary input data, including the merchant reference.
   * @returns A Promise that resolves with the raw HTML string for the payment form.
   * @throws An ApiError or Error if the operation fails.
   */
  generatePayfortForm(site: SiteEnum, input: PayfortFormInput): Promise<string>

  /**
   * Fetches the status of a specific payment transaction.
   * On success, it returns the status enum directly.
   * On failure (e.g., transaction not found), it throws an ApiError.
   *
   * @param merchantReference The merchant reference ID of the transaction to check.
   * @returns A Promise that resolves with the PaymentTransactionStatusEnum.
   */
  checkTransactionStatus(merchantReference: string): Promise<PaymentTransactionStatusEnum>

  /**
   * Recalculates the totals for the user's shopping cart and fetches the updated state.
   * This is typically used after applying discounts or gift cards.
   * On success, it returns the updated ShoppingCartModel instance.
   * On failure, it throws an ApiError for business logic errors or a generic Error for network issues.
   *
   * @param site The site where the cart exists.
   * @returns A Promise that resolves with the updated ShoppingCartModel instance.
   */
  calculateTotalForShoppingCart(site: SiteEnum): Promise<ShoppingCartModel>

  /**
   * Adds a gift card code to the shopping cart.
   * @param giftCard The gift card code.
   * @param site The site where the cart exists.
   * @returns A promise that resolves with a string (method not implemented).
   */
  addGiftCardCodeToShoppingCart(giftCard: string, site: SiteEnum): Promise<ShoppingCartModel>

  /**
   * Removes a gift card from the current shopping cart.
   * @param site The site where the cart exists.
   * @param giftCardCode The gift card code to remove.
   * @returns A Promise that resolves with the updated ShoppingCartModel instance.
   * */
  removeGiftCardFromCurrentShoppingCart(
    site: SiteEnum,
    giftCardCode: string
  ): Promise<ShoppingCartModel>

  /**
   * Locks the user's shopping cart to prevent modifications during payment.
   * @param site The site where the cart exists.
   * @returns A Promise that resolves with `true` on success.
   * @throws An ApiError if the operation fails.
   */
  lockShoppingCart(site: SiteEnum): Promise<boolean>
}
