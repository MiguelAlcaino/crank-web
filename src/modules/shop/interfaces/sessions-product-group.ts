import { ClassPackageTypeEnum } from '@/gql/graphql'
import { ClassPackage } from '../models/Product'

export interface SessionsProductGroup {
  type: ClassPackageTypeEnum
  title: string
  products: ClassPackage[]
}
