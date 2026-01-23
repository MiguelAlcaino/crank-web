import {
  ClassPackage,
  GiftCardProduct,
  type ProductFromQuery,
  ProductModel,
  UnknownProduct
} from '../models/ProductModel'

export function createProductModel(productData: ProductFromQuery): ProductModel {
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
