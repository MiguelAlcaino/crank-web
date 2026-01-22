import type { IShopApiService } from '@/modules/shop/services/IShopApiService'
import type { ApolloClient } from '@apollo/client/core'
import type { SiteEnum } from '@/modules/shared/interfaces/site.enum'
import type { Product, ProductFromQuery } from '../models/Product'
import type { ShoppingCart as ShoppingCartModel } from '../models/ShoppingCart'
import {
  AddDiscountCodeToShoppingCartDocument,
  type AddDiscountCodeToShoppingCartMutation,
  type AddDiscountCodeToShoppingCartMutationVariables,
  AddItemToShoppingCartDocument,
  type AddItemToShoppingCartMutation,
  type AddItemToShoppingCartMutationVariables,
  CalculateTotalForShoppingCartDocument,
  type CalculateTotalForShoppingCartQuery,
  type CalculateTotalForShoppingCartQueryVariables,
  EmptyShoppingCartDocument,
  type EmptyShoppingCartMutation,
  type EmptyShoppingCartMutationVariables,
  GenerateMerchantReferenceDocument,
  type GenerateMerchantReferenceMutation,
  type GenerateMerchantReferenceMutationVariables,
  GeneratePayfortFormDocument,
  type GeneratePayfortFormMutation,
  type GeneratePayfortFormMutationVariables,
  GetCartSummaryDocument,
  GetProductsDocument,
  type GetProductsQuery,
  type GetProductsQueryVariables,
  GetShoppingCartDocument,
  type GetShoppingCartQuery,
  type GetShoppingCartQueryVariables,
  type ItemToShoppingCartInput,
  LockShoppingCartDocument,
  type LockShoppingCartMutation,
  type LockShoppingCartMutationVariables,
  type PayfortFormInput,
  PaymentTransactionStatusDocument,
  PaymentTransactionStatusEnum,
  type PaymentTransactionStatusInput,
  type PaymentTransactionStatusQuery,
  type PaymentTransactionStatusQueryVariables,
  type ProductType,
  RemoveDiscountCodeDocument,
  type RemoveDiscountCodeMutation,
  type RemoveDiscountCodeMutationVariables,
  RemoveItemFromShoppingCartDocument,
  type RemoveItemFromShoppingCartMutation,
  type RemoveItemFromShoppingCartMutationVariables,
  type ShoppingCart as GqlShoppingCart,
  UpdateItemInShoppingCartDocument,
  type UpdateItemInShoppingCartMutation,
  type UpdateItemInShoppingCartMutationVariables
} from '@/gql/graphql'
import { ApiError } from '@/services/utils/ApiError'
import { createShoppingCartModel } from '@/modules/shop/factories/shoppingCartFactory'
import type { AppProductType } from '@/modules/shop/models/types'
import { createProductModel } from '@/modules/shop/factories/productFactory'
import type { CartSummary } from '@/modules/shop/interfaces/cart-summary'

export class ShopApiService implements IShopApiService {
  constructor(private authApiClient: ApolloClient<any>) {}

  async calculateTotalForShoppingCart(site: SiteEnum): Promise<ShoppingCartModel> {
    try {
      const { data, errors } = await this.authApiClient.query<
        CalculateTotalForShoppingCartQuery,
        CalculateTotalForShoppingCartQueryVariables
      >({
        query: CalculateTotalForShoppingCartDocument,
        variables: {
          site: site
        },
        fetchPolicy: 'network-only'
      })

      if (errors) {
        throw new ApiError(
          `GraphQL error calculating cart total: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      const result = data?.calculateTotalForShoppingCart

      if (!result) {
        throw new Error('Did not receive a valid response from the server when calculating total.')
      }

      if (result.__typename === 'ShoppingCart') {
        // Success: The API returned the cart with updated totals.
        // We map the raw DTO to our rich domain model.
        return createShoppingCartModel(result as unknown as GqlShoppingCart)
      } else {
        // Business logic error (e.g., ShoppingCartIsEmpty, DiscountCodeIsInvalid).
        // We throw a structured error for the UI layer to handle.
        const errorCode = (result as { code?: string }).code ?? 'UnknownBusinessError'
        throw new ApiError(
          `Could not calculate total. API returned error: ${result.__typename}`,
          errorCode
        )
      }
    } catch (error) {
      // Catch and re-throw any error for the calling function to handle.
      console.error('ApiService.calculateTotalForShoppingCart failed:', error)
      throw error
    }
  }

  async addGiftCardCodeToShoppingCart(giftCard: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async addDiscountCodeToShoppingCart(
    site: SiteEnum,
    discountCode: string
  ): Promise<ShoppingCartModel> {
    try {
      const { data, errors } = await this.authApiClient.mutate<
        AddDiscountCodeToShoppingCartMutation,
        AddDiscountCodeToShoppingCartMutationVariables
      >({
        mutation: AddDiscountCodeToShoppingCartDocument,
        variables: {
          site,
          discountCode
        },
        fetchPolicy: 'network-only'
      })

      if (errors && errors.length > 0) {
        throw new ApiError(
          `GraphQL error applying discount code: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      const result = data?.addDiscountCodeToShoppingCart

      if (!result) {
        throw new Error('Did not receive a valid response from the server.')
      }

      if (result.__typename === 'ShoppingCart') {
        return createShoppingCartModel(result as unknown as GqlShoppingCart)
      } else {
        const errorCode = (result as { code?: string }).code ?? 'UnknownBusinessError'
        let errorMessage = 'Invalid discount code.'

        if (result.__typename === 'DiscountCodeIsInvalid') {
          errorMessage = 'The provided discount code is not valid.'
        } else if (result.__typename === 'ShoppingCartIsEmpty') {
          errorMessage = 'Cannot apply a discount code to an empty cart.'
        }

        throw new ApiError(errorMessage, errorCode)
      }
    } catch (error) {
      console.error('ApiService.addDiscountCodeToShoppingCart failed:', error)
      throw error
    }
  }

  async addItemToShoppingCart(
    site: SiteEnum,
    sellableProductId: string,
    quantity: number
  ): Promise<ShoppingCartModel> {
    const input: ItemToShoppingCartInput = { sellableProductId, quantity }

    try {
      const { data, errors } = await this.authApiClient.mutate<
        AddItemToShoppingCartMutation,
        AddItemToShoppingCartMutationVariables
      >({
        mutation: AddItemToShoppingCartDocument,
        variables: {
          site: site,
          input: input
        },
        fetchPolicy: 'network-only'
      })

      if (errors) {
        throw new Error(`GraphQL error: ${errors.map((e) => e.message).join(', ')}`)
      }

      const result = data?.addItemToShoppingCart

      if (!result) {
        throw new Error('Did not receive a valid response from the server.')
      }

      if (result.__typename === 'ShoppingCart') {
        // Success: The `result` object is fully typed thanks to the fragment.
        // We can now safely pass it to our model factory.
        return createShoppingCartModel(result as unknown as GqlShoppingCart)
      } else {
        // Business logic error (e.g., ProductNotFound)
        const errorCode = (result as { code?: string }).code ?? 'UnknownBusinessError'
        throw new ApiError(
          `Failed to add item. API returned error: ${result.__typename}`,
          errorCode
        )
      }
    } catch (error) {
      console.error('ApiService.addItemToShoppingCart failed:', error)
      // Re-throw for the UI layer to handle
      throw error
    }
  }

  async checkTransactionStatus(merchantReference: string): Promise<PaymentTransactionStatusEnum> {
    const input: PaymentTransactionStatusInput = { merchantReference }

    try {
      const { data, errors } = await this.authApiClient.query<
        PaymentTransactionStatusQuery,
        PaymentTransactionStatusQueryVariables
      >({
        query: PaymentTransactionStatusDocument,
        variables: { input },
        fetchPolicy: 'network-only'
      })

      if (errors && errors.length > 0) {
        throw new ApiError(
          `GraphQL error fetching transaction status: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      const result = data?.paymentTransactionStatus

      if (!result) {
        throw new Error('Did not receive a valid response from the server for transaction status.')
      }

      if (result.__typename === 'PaymentTransactionStatus') {
        // --- Success Path ---
        // The query was successful, return the status enum directly.
        return result.status
      } else {
        // --- Business Logic Error Path ---
        // The API returned a specific error, like 'TemporalTransactionNotFound'.
        // We throw a structured error for the UI to handle.
        const errorCode = (result as { code?: string }).code ?? 'UnknownBusinessError'
        throw new ApiError(
          `Could not get transaction status. API returned error: ${result.__typename}`,
          errorCode
        )
      }
    } catch (error) {
      // --- Network/GraphQL Error Path ---
      // Catch and re-throw any error for the calling function to handle.
      console.error('ApiService.paymentTransactionStatus failed:', error)
      throw error
    }
  }

  async generateMerchantReference(site: SiteEnum): Promise<string> {
    try {
      const { data, errors } = await this.authApiClient.mutate<
        GenerateMerchantReferenceMutation,
        GenerateMerchantReferenceMutationVariables
      >({
        mutation: GenerateMerchantReferenceDocument,
        variables: { site },
        fetchPolicy: 'network-only'
      })

      if (errors && errors.length > 0) {
        throw new ApiError(
          `GraphQL error generating merchant reference: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      // A missing or empty reference is a critical failure.
      if (!data?.generateMerchantReference) {
        throw new Error('Did not receive a valid merchant reference from the server.')
      }

      // On success, return the reference string.
      return data.generateMerchantReference
    } catch (error) {
      // Catch any error (our thrown errors or network errors) and re-throw it
      // so the calling layer can handle the failure.
      console.error('ApiService.generateMerchantReference failed:', error)
      throw error
    }
  }

  async generatePayfortForm(site: SiteEnum, input: PayfortFormInput): Promise<string> {
    try {
      const { data, errors } = await this.authApiClient.mutate<
        GeneratePayfortFormMutation,
        GeneratePayfortFormMutationVariables
      >({
        // Use the generated DocumentNode for type safety.
        mutation: GeneratePayfortFormDocument,
        variables: { site, input },
        fetchPolicy: 'network-only' // This is a one-time action.
      })

      if (errors && errors.length > 0) {
        throw new ApiError(
          `GraphQL error generating Payfort form: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      // A missing or empty HTML form is a critical failure.
      const htmlForm = data?.payfortForm?.htmlForm
      if (!htmlForm) {
        throw new Error('Did not receive a valid HTML form from the server.')
      }

      // On success, return the HTML string.
      return htmlForm
    } catch (error) {
      // Catch and re-throw any error so the calling layer can handle the failure.
      console.error('ApiService.generatePayfortForm failed:', error)
      throw error
    }
  }

  async getCartDetails(site: SiteEnum): Promise<ShoppingCartModel | null> {
    try {
      const { data, errors } = await this.authApiClient.query<
        GetShoppingCartQuery,
        GetShoppingCartQueryVariables
      >({
        query: GetShoppingCartDocument,
        variables: { site },
        fetchPolicy: 'network-only'
      })

      if (errors) {
        throw new ApiError(
          `GraphQL error fetching shopping cart: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      const cartData = data?.currentUser?.shoppingCart
      if (!cartData) {
        return null
      }

      return createShoppingCartModel(cartData as unknown as GqlShoppingCart)
    } catch (error) {
      console.error('ApiService: Error fetching shopping cart:', error)
      throw new Error('Failed to fetch shopping cart.')
    }
  }

  async getCartSummary(site: SiteEnum): Promise<CartSummary | null> {
    try {
      const { data, errors } = await this.authApiClient.query({
        query: GetCartSummaryDocument,
        variables: { site },
        fetchPolicy: 'network-only'
      })

      if (errors && errors.length > 0) {
        throw new ApiError(
          `GraphQL error fetching cart summary: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      return data?.currentUser?.shoppingCart ?? null
    } catch (error) {
      console.error('ApiService.getCartSummary failed:', error)
      return null
    }
  }

  async getProducts(site: SiteEnum, options?: { type?: AppProductType }): Promise<Product[]> {
    // Create the variables object for the query in a type-safe way.
    const variables: GetProductsQueryVariables = { site }
    if (options?.type) {
      // The `input` variable itself is optional in the GraphQL query.
      // We only add it to the variables object if the type is specified.
      variables.input = { type: options.type as unknown as ProductType }
    }

    try {
      const { data, errors } = await this.authApiClient.query<
        GetProductsQuery,
        GetProductsQueryVariables
      >({
        // Use the strongly-typed DocumentNode from our generated file.
        query: GetProductsDocument,
        variables,
        fetchPolicy: 'network-only'
      })

      // It's best practice to check for the `errors` array returned by GraphQL.
      if (errors && errors.length > 0) {
        throw new ApiError(
          `GraphQL error fetching products: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      // If the API returns null or an empty array for products, we simply return an empty array.
      // This is expected behavior, not an error.
      if (!data || !data.products) {
        return []
      }

      // Map the raw DTOs from the API to our rich domain models using the factory.
      return data.products.map((productData) => createProductModel(productData as ProductFromQuery))
    } catch (error) {
      // Any exception (our ApiError, a network error, etc.) is caught here.
      // We log it and then re-throw it. This allows the calling code (e.g., a composable)
      // to catch the error and update the UI state (e.g., show an error message).
      console.error('ApiService: Failed to fetch products.', error)
      throw error
    }
  }

  async lockShoppingCart(site: SiteEnum): Promise<boolean> {
    try {
      const { data, errors } = await this.authApiClient.mutate<
        LockShoppingCartMutation,
        LockShoppingCartMutationVariables
      >({
        mutation: LockShoppingCartDocument,
        variables: { site },
        fetchPolicy: 'network-only'
      })

      if (errors && errors.length > 0) {
        throw new ApiError(
          `GraphQL error locking the cart: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      if (typeof data?.lockShoppingCart !== 'boolean') {
        throw new Error(
          'Did not receive a valid boolean response from the server when locking the cart.'
        )
      }

      return data.lockShoppingCart
    } catch (error) {
      // --- Network/GraphQL Error Path ---
      // Catch and re-throw any error for the calling function to handle.
      console.error('ApiService.lockShoppingCart failed:', error)
      throw error
    }
  }

  async removeDiscountCode(site: SiteEnum): Promise<ShoppingCartModel> {
    try {
      const { data, errors } = await this.authApiClient.mutate<
        RemoveDiscountCodeMutation,
        RemoveDiscountCodeMutationVariables
      >({
        mutation: RemoveDiscountCodeDocument,
        variables: { site },
        fetchPolicy: 'network-only'
      })

      if (errors && errors.length > 0) {
        throw new ApiError(
          `GraphQL error removing discount code: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      const result = data?.removeDiscountCodeForCurrentShoppingCart

      if (!result) {
        throw new Error(
          'Did not receive a valid response from the server when removing discount code.'
        )
      }

      if (result.__typename === 'ShoppingCart') {
        // Success: The API returned the updated cart.
        // We mapped the DTO to our domain model.
        return createShoppingCartModel(result as unknown as GqlShoppingCart)
      } else {
        // Business Error: Cart not found, for example.
        const errorCode = (result as { code?: string }).code ?? 'UnknownBusinessError'
        throw new ApiError(
          `Could not remove discount code. API returned error: ${result.__typename}`,
          errorCode
        )
      }
    } catch (error) {
      // --- Network/GraphQL Error Path ---
      // Catch and re-throw any error for the calling function to handle.
      console.error('ApiService.removeDiscountCode failed:', error)
      throw error
    }
  }

  async removeItemFromShoppingCart(
    site: SiteEnum,
    shoppingCartItemId: string
  ): Promise<ShoppingCartModel> {
    try {
      const { data, errors } = await this.authApiClient.mutate<
        RemoveItemFromShoppingCartMutation,
        RemoveItemFromShoppingCartMutationVariables
      >({
        mutation: RemoveItemFromShoppingCartDocument,
        variables: {
          site,
          shoppingCartItemId
        },
        fetchPolicy: 'network-only'
      })

      if (errors) {
        throw new ApiError(
          `GraphQL error removing item from cart: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      const result = data?.removeItemFromShoppingCart

      if (!result) {
        throw new Error('Did not receive a valid response from the server.')
      }

      if (result.__typename === 'ShoppingCart') {
        // Success: The API returned the updated cart.
        // We map the raw DTO to our rich domain model.
        return createShoppingCartModel(result as unknown as GqlShoppingCart)
      } else {
        // Business logic error (e.g., ShoppingCartItemNotFound).
        // We throw a structured error for the UI layer to handle.
        const errorCode = (result as { code?: string }).code ?? 'UnknownBusinessError'
        throw new ApiError(
          `Failed to remove item. API returned error: ${result.__typename}`,
          errorCode
        )
      }
    } catch (error) {
      // Catch and re-throw any error for the calling function to handle.
      console.error('ApiService.removeItemFromShoppingCart failed:', error)
      throw error
    }
  }

  async updateItemInShoppingCart(
    site: SiteEnum,
    sellableProductId: string,
    quantity: number
  ): Promise<ShoppingCartModel> {
    try {
      const { data, errors } = await this.authApiClient.mutate<
        UpdateItemInShoppingCartMutation,
        UpdateItemInShoppingCartMutationVariables
      >({
        mutation: UpdateItemInShoppingCartDocument,
        variables: {
          site,
          shoppingCartItemId: sellableProductId,
          quantity: quantity
        },
        fetchPolicy: 'network-only'
      })

      if (errors) {
        throw new ApiError(
          `GraphQL error updating item in cart: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      const result = data?.updateItemInShoppingCart

      if (!result) {
        throw new Error('Did not receive a valid response from the server.')
      }

      if (result.__typename === 'ShoppingCart') {
        // Success: Map the raw DTO to our rich domain model.
        return createShoppingCartModel(result as unknown as GqlShoppingCart)
      } else {
        // Business logic error: Throw a structured error for the UI to handle.
        const errorCode = (result as { code?: string }).code ?? 'UnknownBusinessError'
        throw new ApiError(
          `Failed to update item. API returned error: ${result.__typename}`,
          errorCode
        )
      }
    } catch (error) {
      // Catch and re-throw any error for the calling function to handle.
      console.error('ApiService.updateItemInShoppingCart failed:', error)
      throw error
    }
  }

  public async clearShoppingCart(site: SiteEnum): Promise<ShoppingCartModel> {
    try {
      const { data, errors } = await this.authApiClient.mutate<
        EmptyShoppingCartMutation,
        EmptyShoppingCartMutationVariables
      >({
        mutation: EmptyShoppingCartDocument,
        variables: { site },
        fetchPolicy: 'network-only'
      })

      if (errors && errors.length > 0) {
        throw new ApiError(
          `GraphQL error clearing the cart: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      const result = data?.emptyShoppingCart

      if (!result) {
        throw new Error('Did not receive a valid response from the server when clearing the cart.')
      }

      if (result.__typename === 'ShoppingCart') {
        // Success: The API returned the empty cart.
        return createShoppingCartModel(result as unknown as GqlShoppingCart)
      } else {
        const errorCode = (result as { code?: string }).code ?? 'UnknownBusinessError'
        throw new ApiError(
          `Could not clear cart. API returned error: ${result.__typename}`,
          errorCode
        )
      }
    } catch (error) {
      // --- Network/GraphQL Error Path ---
      // Catch and re-throw any error for the calling function to handle.
      console.error('ApiService.clearShoppingCart failed:', error)
      throw error
    }
  }
}
