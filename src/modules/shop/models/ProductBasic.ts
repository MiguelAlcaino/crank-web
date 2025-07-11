import type { GetShoppingCartQuery } from '@/gql/graphql'
import type { IconName } from '@/modules/shop/models/types'

export type ProductFromCartItem = NonNullable<
  NonNullable<GetShoppingCartQuery['currentUser']>['shoppingCart']['items']
>[number]['variant']['product']

export class ProductBasic {
  public readonly id: string
  public readonly title: string
  public readonly subtitle: string | null
  public readonly currency: string
  public readonly alertBeforePurchasing?: {
    title: string
    description: string
  }

  public readonly classPackageType?: string
  public readonly purchaseUrl?: string

  constructor(gqlProduct: ProductFromCartItem) {
    this.id = gqlProduct.id
    this.title = gqlProduct.title
    this.subtitle = gqlProduct.subtitle ?? null
    this.currency = gqlProduct.currency
    this.alertBeforePurchasing = gqlProduct.alertBeforePurchasing
      ? {
          title: gqlProduct.alertBeforePurchasing.title,
          description: gqlProduct.alertBeforePurchasing.description
        }
      : undefined

    if (gqlProduct.__typename === 'ClassPackageProduct') {
      this.classPackageType = gqlProduct.type ?? 'unknown'
    } else if (gqlProduct.__typename === 'GiftCard') {
      this.purchaseUrl = gqlProduct.purchaseUrl
    }
  }

  public get productType(): 'class_package' | 'gift_card' | 'unknown' {
    if (this.classPackageType) {
      return 'class_package'
    }
    if (this.purchaseUrl) {
      return 'gift_card'
    }
    return 'unknown'
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
