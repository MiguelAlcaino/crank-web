import type { ClassPackageTypeEnum } from '@/gql/graphql'
import type { ClassPackage } from '../models/Product'

export interface SessionsProductGroup {
  type: ClassPackageTypeEnum
  title: string
  products: ClassPackage[]
}
