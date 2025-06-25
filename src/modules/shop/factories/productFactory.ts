import type { GetProductsQuery } from '@/gql/graphql'
import { ClassPackage, GiftCardProduct, Product, UnknownProduct } from '../models/Product'

// A utility type to correctly infer the type of a single product from the API response
type ProductFromQuery = NonNullable<GetProductsQuery['products']>[number]

export function createProductModel(productData: ProductFromQuery): Product {
  switch (productData.__typename) {
    case 'ClassPackageProduct':
      return new ClassPackage(productData)
    case 'GiftCard':
      return new GiftCardProduct(productData)
    default:
      console.warn('Unknown product type received from API:', (productData as any)?.__typename)
      return new UnknownProduct(productData)
  }
}
