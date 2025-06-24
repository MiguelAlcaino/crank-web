import type { ShoppingCart as GqlShoppingCart } from '@/gql/graphql'
import { ShoppingCart as ShoppingCartModel } from '../models/ShoppingCart'

/**
 * Factory to create a ShoppingCart domain model from raw GraphQL data.
 * @param gqlCart The shopping cart object from the GraphQL API.
 * @returns A new instance of the ShoppingCart model.
 */
export function createShoppingCartModel(gqlCart: GqlShoppingCart): ShoppingCartModel {
  return new ShoppingCartModel(gqlCart)
}
