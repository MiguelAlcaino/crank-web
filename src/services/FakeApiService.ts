import type {
  AcceptLateCancelledSpotInClassResultUnion,
  BookClassInput,
  CancelEnrollmentInput,
  Class,
  ClassInfo,
  ClassStat,
  Country,
  CreateCurrentUserInSiteUnion,
  CurrentUserEnrollmentsParams,
  EditClassInput,
  EditClassResultUnion,
  EditEnrollmentInput,
  EditEnrollmentResultUnion,
  EnrollmentInfo,
  PaginatedClassStats,
  PaginatedEnrollments,
  PaginatedPurchases,
  PaginationInput,
  PayfortFormInput,
  RegisterUserInput,
  RejectLateBookingResultUnion,
  RemoveCurrentUserFromWaitlistInput,
  RemoveUserFromWaitlistUnion,
  ResetPasswordForCurrentUserUnion,
  ResetPasswordLinkResultUnion,
  Site,
  SiteSetting,
  UpdateCurrentUserPasswordInput,
  User,
  UserInClassRanking,
  UserInput,
  UserInRankingParams
} from '@/gql/graphql'
import { PaymentTransactionStatusEnum } from '@/gql/graphql'
import type { CustomCalendarClasses } from '@/model/CustomCalendarClasses'
import type { IsSmsValidationCodeValidResponse } from '@/modules/buy_packages/models/is-sms-validation-code-valid-response'
import type { SmsValidationResponse } from '@/modules/buy_packages/models/sms-validation-response'
import type { IApiService } from './IApiService'
import type { Product, ProductFromQuery } from '@/modules/shop/models/Product'
import type { ShoppingCart as ShoppingCartModel } from '@/modules/shop/models/ShoppingCart'
import type { AppProductType } from '@/modules/shop/models/types'
import type { SiteEnum } from '@/modules/shared/interfaces/site.enum'
import type { BasicUser } from '@/modules/auth/types'
import type { CartSummary } from '@/modules/shop/interfaces/cart-summary'
import { createProductModel } from '@/modules/shop/factories/productFactory'
import { createShoppingCartModel } from '@/modules/shop/factories/shoppingCartFactory'

import type {
  ShoppingCart as GqlShoppingCart,
  ShoppingCartItem as GqlShoppingCartItem
} from '@/gql/graphql'
import { ClassPackageTypeEnum } from '@/modules/shop/interfaces'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class FakeApiService implements IApiService {
  // --- PRIVATE STATE ---
  // This is our in-memory "database"
  private _products: ProductFromQuery[] = []
  private _shoppingCart: GqlShoppingCart | null = null
  private _currentUser: BasicUser | null = null
  private _purchaseHistory: Set<string> = new Set() // Tracks IDs of purchased products

  constructor() {
    this._initializeData()
    console.warn(
      '%c FAKE API IN USE ',
      'background: #ff8c69; color: #fff; border-radius: 3px; font-weight: bold;',
      'The application is running with a simulated backend. All data is temporary.'
    )
  }

  // --- INITIALIZATION ---
  private _initializeData(): void {
    // Initialize a fake user
    this._currentUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@crank.com'
    }

    // Initialize a set of fake products
    this._products = [
      {
        __typename: 'ClassPackageProduct',
        id: 'prod_1',
        title: 'SINGLE CLASS',
        subtitle: '1 Credit',
        currency: 'AED',
        buttonText: 'ADD',
        isVisible: true,
        alertBeforePurchasing: null,
        type: ClassPackageTypeEnum.Regular,
        variants: [{ __typename: 'Variant', id: 'var_1', name: null, price: 125, position: 1 }]
      },
      {
        __typename: 'ClassPackageProduct',
        id: 'prod_2',
        title: 'FIRST TIMER 3 PACK',
        subtitle: 'OFFER VALID EXCLUSIVELY FOR FIRST TIMERS!',
        currency: 'AED',
        buttonText: 'ADD',
        isVisible: true,
        alertBeforePurchasing: {
          __typename: 'ProductAlertBeforePurchasing',
          title: 'Exclusively Limited to First Timers Only!',
          description:
            'If you are a first timer, please make sure to arrive to CRANK 15 minutes before the start of your class to make sure that you get familiar with our facilities!'
        },
        type: ClassPackageTypeEnum.Trial,
        variants: [{ __typename: 'Variant', id: 'var_2', name: null, price: 185, position: 1 }]
      },
      {
        __typename: 'ClassPackageProduct',
        id: 'prod_3',
        title: '5 CLASS PACK',
        subtitle: '5 Credits',
        currency: 'AED',
        buttonText: 'ADD',
        isVisible: true,
        alertBeforePurchasing: null,
        type: ClassPackageTypeEnum.Regular,
        variants: [{ __typename: 'Variant', id: 'var_3', name: null, price: 600, position: 1 }]
      },
      {
        __typename: 'ClassPackageProduct',
        id: 'prod_already_purchased',
        title: 'ALREADY BOUGHT PACK',
        subtitle: 'You cannot buy this again.',
        currency: 'AED',
        buttonText: 'ADD',
        isVisible: true,
        alertBeforePurchasing: null,
        type: ClassPackageTypeEnum.Special,
        variants: [{ __typename: 'Variant', id: 'var_4', name: null, price: 50, position: 1 }]
      }
    ]

    // Initialize an empty shopping cart
    this._shoppingCart = {
      __typename: 'ShoppingCart',
      id: 'cart_123',
      currency: 'AED',
      giftCardsCodes: [],
      discountCode: null,
      items: [],
      total: {
        __typename: 'ShoppingCartTotal',
        total: 0,
        subTotal: 0,
        giftCardAmount: 0,
        amountToPay: 0
      }
    }

    // Simulate that the user has already bought one item in the past
    this._purchaseHistory.add('prod_already_purchased')
  }

  // --- PRIVATE HELPERS ---

  private _recalculateCartTotals(): void {
    if (!this._shoppingCart || this._shoppingCart.total?.__typename !== 'ShoppingCartTotal') return

    const subTotal = this._shoppingCart.items.reduce((total, item) => {
      const variantInfo = this._findVariant(item.variant.id)
      const price = variantInfo?.variant.price ?? 0
      return total + price * item.quantity
    }, 0)

    this._shoppingCart.total.subTotal = subTotal

    // Simulate a simple discount
    let total = subTotal
    if (this._shoppingCart.discountCode === 'SAVE10') {
      total = subTotal * 0.9
    }

    this._shoppingCart.total.total = total
    this._shoppingCart.total.amountToPay = total
  }

  private _findVariant(
    variantId: string
  ): { product: ProductFromQuery; variant: ProductFromQuery['variants'][0] } | undefined {
    for (const product of this._products) {
      const variant = product.variants.find((v) => v.id === variantId)
      if (variant) {
        return { product, variant }
      }
    }
    return undefined
  }

  async getMyselfBasic(): Promise<BasicUser | null> {
    await delay(100)
    console.log(`[FakeAPI] getMyselfBasic called`)
    return this._currentUser
  }
  async getCartSummary(site: SiteEnum): Promise<CartSummary | null> {
    await delay(300)
    console.log('[FakeAPI] getCartSummary called')
    if (!this._shoppingCart) return null

    // Return only the essential fields for a summary
    return {
      id: this._shoppingCart.id,
      items: this._shoppingCart.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        variant: { id: item.variant.id }
      }))
    }
  }
  getSiteSettings(site: SiteEnum): Promise<SiteSetting | null> {
    throw new Error('Method not implemented.')
  }

  getMyself(): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  currentUserSingleWorkoutStat(enrollmentId: string): Promise<ClassStat> {
    throw new Error('Method not implemented.')
  }

  getCurrentUserEnrollmentInClass(classId: string): Promise<EnrollmentInfo | null> {
    throw new Error('Method not implemented.')
  }

  getCountries(): Promise<Country[]> {
    throw new Error('Method not implemented.')
  }

  getCountry(countryCode: string): Promise<Country | null> {
    throw new Error('Method not implemented.')
  }

  getCalendarClasses(site: SiteEnum, startDate: string, endDate: string): Promise<Class[]> {
    throw new Error('Method not implemented.')
  }

  getCustomCalendarClasses(
    site: SiteEnum,
    startDate: string,
    endDate: string
  ): Promise<CustomCalendarClasses> {
    throw new Error('Method not implemented.')
  }

  getClassInfo(site: SiteEnum, id: string): Promise<ClassInfo | null> {
    throw new Error('Method not implemented.')
  }

  registerUser(site: SiteEnum, input: RegisterUserInput): Promise<string> {
    throw new Error('Method not implemented.')
  }

  updateCurrentUser(input: UserInput): Promise<string> {
    throw new Error('Method not implemented.')
  }

  bookClass(site: SiteEnum, input: BookClassInput): Promise<string> {
    throw new Error('Method not implemented.')
  }

  cancelCurrentUserEnrollment(site: SiteEnum, input: CancelEnrollmentInput): Promise<string> {
    throw new Error('Method not implemented.')
  }

  removeCurrentUserFromWaitlist(
    site: SiteEnum,
    input: RemoveCurrentUserFromWaitlistInput
  ): Promise<any> {
    throw new Error('Method not implemented.')
  }

  removeUserFromClass(enrollmentId: string, lateCancel?: boolean): Promise<string> {
    throw new Error('Method not implemented.')
  }

  editClass(input: EditClassInput): Promise<EditClassResultUnion> {
    throw new Error('Method not implemented.')
  }

  updateCurrentUserPassword(
    site: SiteEnum,
    input: UpdateCurrentUserPasswordInput
  ): Promise<string> {
    throw new Error('Method not implemented.')
  }

  editCurrentUserEnrollment(
    site: SiteEnum,
    enrollmentId: string,
    newSpotNumber: number
  ): Promise<string> {
    throw new Error('Method not implemented.')
  }

  requestPasswordLink(email: string): Promise<ResetPasswordLinkResultUnion | null> {
    throw new Error('Method not implemented.')
  }

  resetPasswordForCurrentUser(
    password: string,
    repeatedPassword: string
  ): Promise<ResetPasswordForCurrentUserUnion | null> {
    throw new Error('Method not implemented.')
  }

  currentUserDoesExistInSite(site: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  createCurrentUserInSite(
    fromSite: string,
    toSite: string
  ): Promise<CreateCurrentUserInSiteUnion | null> {
    throw new Error('Method not implemented.')
  }

  removeUserFromWaitlist(waitlistEntryId: string): Promise<RemoveUserFromWaitlistUnion> {
    throw new Error('Method not implemented.')
  }

  editEnrollment(site: SiteEnum, input: EditEnrollmentInput): Promise<EditEnrollmentResultUnion> {
    throw new Error('Method not implemented.')
  }

  getCurrentUserSites(): Promise<SiteEnum[]> {
    throw new Error('Method not implemented.')
  }

  getCurrentUserRankingInClass(
    site: SiteEnum,
    params: UserInRankingParams
  ): Promise<UserInClassRanking> {
    throw new Error('Method not implemented.')
  }

  acceptLateCancelledSpotInClass(
    site: SiteEnum,
    waitlistEntryId: string
  ): Promise<AcceptLateCancelledSpotInClassResultUnion> {
    throw new Error('Method not implemented.')
  }

  rejectLateCancelledSpotInClass(
    site: SiteEnum,
    waitlistEntryId: string
  ): Promise<RejectLateBookingResultUnion> {
    throw new Error('Method not implemented.')
  }

  currentUserEnrollmentsPaginated(
    site: SiteEnum,
    params: CurrentUserEnrollmentsParams,
    pagination: PaginationInput
  ): Promise<PaginatedEnrollments> {
    throw new Error('Method not implemented.')
  }

  currentUserWorkoutStatsPaginated(
    site: SiteEnum,
    pagination: PaginationInput
  ): Promise<PaginatedClassStats> {
    throw new Error('Method not implemented.')
  }

  currentUserPurchasesPaginated(
    site: SiteEnum,
    pagination: PaginationInput
  ): Promise<PaginatedPurchases> {
    throw new Error('Method not implemented.')
  }

  currentUserPhoneNumber(): Promise<string> {
    throw new Error('Method not implemented.')
  }

  requestSMSValidation(countryCode: string, mobilePhone: string): Promise<SmsValidationResponse> {
    throw new Error('Method not implemented.')
  }

  isSMSValidationCodeValid(smsCode: string): Promise<IsSmsValidationCodeValidResponse> {
    throw new Error('Method not implemented.')
  }

  availableSites(): Promise<Site[]> {
    throw new Error('Method not implemented.')
  }

  async getProducts(site: SiteEnum, options?: { type?: AppProductType }): Promise<Product[]> {
    await delay(500) // Simulate network latency
    console.log('[FakeAPI] getProducts called')

    // Return a deep copy to prevent direct mutation of the state
    const productsData = JSON.parse(JSON.stringify(this._products))

    return productsData.map((p: ProductFromQuery) => createProductModel(p))
  }

  async addItemToShoppingCart(
    site: SiteEnum,
    variantId: string,
    quantity: number
  ): Promise<ShoppingCartModel> {
    await delay(400)
    console.log(`[FakeAPI] addItemToShoppingCart called with variantId: ${variantId}`)

    if (!this._shoppingCart) {
      throw new Error('Shopping cart not initialized')
    }

    const found = this._findVariant(variantId)
    if (!found) {
      throw new Error('Product variant not found')
    }

    const { product, variant } = found

    const existingItem = this._shoppingCart.items.find((item) => item.variant.id === variantId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      const newCartItem: GqlShoppingCartItem = {
        __typename: 'ShoppingCartItem',
        id: `cart_item_${Date.now()}`,
        quantity,
        subtotal: quantity * variant.price,
        variant: {
          __typename: 'Variant',
          id: variant.id,
          name: variant.name,
          price: variant.price,
          position: variant.position,
          product: {
            __typename: product.__typename,
            id: product.id,
            title: product.title,
            subtitle: product.subtitle,
            currency: product.currency,
            alertBeforePurchasing: product.alertBeforePurchasing
          } as any
        }
      }
      this._shoppingCart.items.push(newCartItem)
    }

    this._recalculateCartTotals()
    return this.getCartDetails(site) as Promise<ShoppingCartModel>
  }

  async removeItemFromShoppingCart(
    site: SiteEnum,
    shoppingCartItemId: string
  ): Promise<ShoppingCartModel> {
    await delay(400)
    console.log(`[FakeAPI] removeItemFromShoppingCart called with id: ${shoppingCartItemId}`)

    if (!this._shoppingCart) throw new Error('Shopping cart not initialized')

    this._shoppingCart.items = this._shoppingCart.items.filter(
      (item) => item.id !== shoppingCartItemId
    )

    this._recalculateCartTotals()
    return this.getCartDetails(site) as Promise<ShoppingCartModel>
  }

  async updateItemInShoppingCart(
    site: SiteEnum,
    shoppingCartItemId: string,
    newQuantity: number
  ): Promise<ShoppingCartModel> {
    await delay(400)
    console.log(
      `[FakeAPI] updateItemInShoppingCart called for item ${shoppingCartItemId} with quantity ${newQuantity}`
    )

    if (!this._shoppingCart) throw new Error('Shopping cart not initialized')

    const itemToUpdate = this._shoppingCart.items.find((item) => item.id === shoppingCartItemId)

    if (!itemToUpdate) throw new Error('Cart item not found')

    if (newQuantity <= 0) {
      return this.removeItemFromShoppingCart(site, shoppingCartItemId)
    }

    itemToUpdate.quantity = newQuantity

    this._recalculateCartTotals()
    return this.getCartDetails(site) as Promise<ShoppingCartModel>
  }

  addGiftCardCodeToShoppingCart(giftCard: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async addDiscountCodeToShoppingCart(
    site: SiteEnum,
    discountCode: string
  ): Promise<ShoppingCartModel> {
    await delay(600)
    console.log(`[FakeAPI] addDiscountCodeToShoppingCart called with code: ${discountCode}`)

    if (!this._shoppingCart) throw new Error('Cart not initialized')

    if (discountCode.toUpperCase() === 'INVALID') {
      throw new Error('The provided discount code is not valid.')
    }

    this._shoppingCart.discountCode = discountCode.toUpperCase()
    this._recalculateCartTotals()
    return this.getCartDetails(site) as Promise<ShoppingCartModel>
  }

  calculateTotalForShoppingCart(site: SiteEnum): Promise<ShoppingCartModel> {
    throw new Error('Method not implemented.')
  }

  async generatePayfortForm(site: SiteEnum, input: PayfortFormInput): Promise<string> {
    await delay(500)
    console.log(`[FakeAPI] generatePayfortForm called`)
    // Return a basic HTML form structure. The form manager will append the necessary fields.
    // The action points to a non-existent page, but the form submission will redirect the user anyway.
    return `<form action="/fake-payfort-redirect" method="POST" name="payfort_payment_form"></form>`
  }

  async generateMerchantReference(site: SiteEnum): Promise<string> {
    await delay(200)
    // We encode the intended result in the reference for easy testing
    const statuses = ['SUCCESS', 'REJECTED', 'WAITING']
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    const ref = `FAKE-REF-${randomStatus}-${Date.now()}`
    console.log(`[FakeAPI] generateMerchantReference created: ${ref}`)
    return ref
  }

  getCurrentUserSitesWithNames(): Promise<Site[]> {
    throw new Error('Method not implemented.')
  }

  async checkTransactionStatus(merchantReference: string): Promise<PaymentTransactionStatusEnum> {
    await delay(1500)
    console.log(`[FakeAPI] checkTransactionStatus for ref: ${merchantReference}`)

    if (merchantReference.includes('SUCCESS')) {
      return PaymentTransactionStatusEnum.Successful
    }
    if (merchantReference.includes('REJECTED')) {
      return PaymentTransactionStatusEnum.Rejected
    }
    if (merchantReference.includes('WAITING')) {
      return PaymentTransactionStatusEnum.WaitingConfirmation
    }

    return PaymentTransactionStatusEnum.Rejected // Default fallback
  }

  async getCartDetails(site: SiteEnum): Promise<ShoppingCartModel | null> {
    await delay(300)
    console.log('[FakeAPI] getCartDetails called')
    if (this._shoppingCart) {
      return createShoppingCartModel(JSON.parse(JSON.stringify(this._shoppingCart)))
    }
    return null
  }

  async clearShoppingCart(site: SiteEnum): Promise<ShoppingCartModel> {
    await delay(400)
    console.log(`[FakeAPI] clearShoppingCart called`)

    if (!this._shoppingCart) throw new Error('Cart not initialized')

    this._shoppingCart.items = []
    this._recalculateCartTotals()
    return this.getCartDetails(site) as Promise<ShoppingCartModel>
  }

  lockShoppingCart(site: SiteEnum): Promise<boolean> {
    console.log(`[FakeAPI] lockShoppingCart called`)
    return Promise.resolve(true) // Simulate success
  }

  async removeDiscountCode(site: SiteEnum): Promise<ShoppingCartModel> {
    await delay(400)
    console.log(`[FakeAPI] removeDiscountCode called`)

    if (!this._shoppingCart) throw new Error('Cart not initialized')

    this._shoppingCart.discountCode = null
    this._recalculateCartTotals()
    return this.getCartDetails(site) as Promise<ShoppingCartModel>
  }
}
