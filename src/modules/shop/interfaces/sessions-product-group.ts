import { ClassPackageTypeEnum } from '@/gql/graphql'
import { ClassPackage } from '../models/product'

export interface SessionsProductGroup {
  type: ClassPackageTypeEnum
  title: string
  products: ClassPackage[]
}
