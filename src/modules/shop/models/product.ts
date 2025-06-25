import { ClassPackageTypeEnum, type GetProductsQuery } from '@/gql/graphql'
import { formatPrice } from '@/modules/shop/utils/shop-utils'

// Create a reusable utility type for a single product from the API response.
// This makes the code cleaner and easier to read than repeating ProductsQuery['products'][number].
type ProductFromQuery = NonNullable<GetProductsQuery['products']>[number]

/**
 * An abstract base class representing a generic sellable product.
 * It encapsulates common properties and logic shared across all product types.
 * This class is intended to be extended, not instantiated directly.
 */
export abstract class Product {
  // --- Public, immutable properties ---
  public readonly id: string
  public readonly title: string
  public readonly subtitle: string
  public readonly currency: string
  public readonly price: number
  public readonly buttonText: string
  public readonly alert?: { title: string; description: string }

  // An abstract property that child classes MUST implement.
  // This is a great way to enforce the product type at the class level.
  public abstract readonly productType: 'class_package' | 'gift_card' | 'unknown'

  protected constructor(data: ProductFromQuery) {
    this.id = data.id
    this.title = data.title
    this.price = data.price ?? 0
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
    return formatPrice(this.price, this.currency, locale)
  }
}

// 2. Class for Class Packages
export class ClassPackage extends Product {
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
}

// 3. Gift Card Class
export class GiftCardProduct extends Product {
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
export class UnknownProduct extends Product {
  public readonly productType = 'unknown'

  constructor(data: ProductFromQuery) {
    super(data)
  }
}
