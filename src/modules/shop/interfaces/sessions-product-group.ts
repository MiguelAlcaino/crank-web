import type { ClassPackageTypeEnum } from '@/gql/graphql'
import type { ClassPackage } from '../models/ProductModel'

export interface SessionsProductGroup {
  type: ClassPackageTypeEnum
  title: string
  products: ClassPackage[]
}
