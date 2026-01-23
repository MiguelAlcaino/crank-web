import { ClassPackageTypeEnum, type GetProductsQuery } from '@/gql/graphql'
import type { IconName } from '@/modules/shop/models/types'
import { VariantBasicModel, type VariantFromProductQuery } from '@/modules/shop/models/VariantBasicModel'
import { formatPrice } from '../utils/shop-utils' // Create a reusable utility type for a single product from the API response.

// Create a reusable utility type for a single product from the API response.
// This makes the code cleaner and easier to read than repeating ProductsQuery['products'][number].
export type ProductFromQuery = NonNullable<GetProductsQuery['products']>[number]

/**
 * An abstract base class representing a generic sellable product.
 * It encapsulates common properties and logic shared across all product types.
 * This class is intended to be extended, not instantiated directly.
 */
export abstract class ProductModel {
  public readonly id: string
  public readonly title: string
  public readonly variants: readonly VariantBasicModel[]
  public readonly subtitle: string
  public readonly currency: string
  public readonly buttonText: string
  public readonly alert?: { title: string; description: string }

  public abstract readonly productType: 'class_package' | 'gift_card' | 'unknown'

  protected constructor(data: ProductFromQuery) {
    this.id = data.id
    this.title = data.title
    this.variants = data.variants
      ? data.variants.map((v) => new VariantBasicModel(v as VariantFromProductQuery))
      : []
    this.subtitle = data.subtitle ?? ''
    this.currency = data.currency
    this.buttonText = data.buttonText ?? 'Add to Cart'
    this.alert = data.alertBeforePurchasing
      ? {
          title: data.alertBeforePurchasing.title,
          description: data.alertBeforePurchasing.description
        }
      : undefined
  }

  /**
   * Returns the product's price as a formatted currency string by
   * delegating to the centralized `formatPrice` utility.
   *
   * @param locale Optional locale to use for formatting (e.g., 'en-AE').
   * @returns A formatted string like "AED 150.00".
   */
  public getFormattedPrice(locale?: string): string {
    const price = this.variants[0]?.price ?? 0
    return formatPrice(price, this.currency, locale)
  }

  public get iconName(): IconName {
    if (this.productType == 'class_package') {
      return 'bag'
    } else if (this.productType == 'gift_card') {
      return 'gift'
    }

    return 'bag'
  }
}

// 2. Class for Class Packages
export class ClassPackage extends ProductModel {
  public readonly productType = 'class_package'
  public readonly classPackageType: ClassPackageTypeEnum | 'unknown'

  constructor(data: ProductFromQuery) {
    super(data)

    if (data.__typename === 'ClassPackageProduct') {
      this.classPackageType = data.type ?? 'unknown'
    } else {
      this.classPackageType = 'unknown'
    }
  }

  public get isVodPackage(): boolean {
    return this.classPackageType === ClassPackageTypeEnum.Vod
  }

  public get isMembershipPackage(): boolean {
    return this.classPackageType === ClassPackageTypeEnum.Membership
  }

  public get isRegularPackage(): boolean {
    return this.classPackageType === ClassPackageTypeEnum.Regular
  }

  public get isSpecialPackage(): boolean {
    return this.classPackageType === ClassPackageTypeEnum.Special
  }
}

// 3. Gift Card Class
export class GiftCardProduct extends ProductModel {
  public readonly productType = 'gift_card'
  public readonly purchaseUrl: string

  constructor(data: ProductFromQuery) {
    super(data)
    if (data.__typename === 'GiftCard') {
      this.purchaseUrl = data.purchaseUrl
    } else {
      this.purchaseUrl = ''
    }
  }
}

// 4. A class for unknown types
export class UnknownProduct extends ProductModel {
  public readonly productType = 'unknown'

  constructor(data: ProductFromQuery) {
    super(data)
  }
}
