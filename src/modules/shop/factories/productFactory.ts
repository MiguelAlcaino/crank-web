import type { ProductsQuery } from '@/gql/graphql'
import { ClassPackage, GiftCardProduct, Product, UnknownProduct } from '../models/product'

type ProductFromQuery = ProductsQuery['products'][number]

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
