import { type ProductsQuery, ClassPackageTypeEnum } from '@/gql/graphql'

type ProductFromQuery = ProductsQuery['products'][number]

// 1. Abstract base class
export abstract class Product {
  public readonly id: string
  public readonly title: string
  public readonly subtitle: string | null
  public readonly currency: string
  public readonly buttonText: string
  public readonly alert?: { title: string; description: string }

  // A property to easily know the type of product
  public abstract readonly productType: 'class_package' | 'gift_card' | 'unknown'

  constructor(data: ProductFromQuery) {
    this.id = data.id
    this.title = data.title
    this.subtitle = data.subtitle ?? null
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
   * Formats the price to a string in the local currency format.
   * @param price The price to format.
   * @returns A formatted string representing the price in the local currency.
   */
  public getFormattedPrice(price: number): string {
    return new Intl.NumberFormat('en-AE', { style: 'currency', currency: this.currency }).format(
      price
    )
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
