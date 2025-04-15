import { ERROR_UNKNOWN } from '@/utils/errorMessages'
import type { PaymentTransactionStatusEnum } from '@/modules/shop/interfaces/payment-transaction-status-enum'

export class PaymentTransactionResponse {
  code: 'PaymentTransactionStatus' | 'TemporalTransactionNotFound' | 'UnknownError'
  status?: PaymentTransactionStatusEnum

  constructor(
    typeName: 'PaymentTransactionStatus' | 'TemporalTransactionNotFound' | 'UnknownError',
    status?: PaymentTransactionStatusEnum
  ) {
    this.code = typeName
    this.status = status
  }

  get message(): string {
    switch (this.code) {
      case 'TemporalTransactionNotFound':
        return ''
      default:
        return ERROR_UNKNOWN
    }
  }

  get success(): boolean {
    return this.code === 'PaymentTransactionStatus'
  }
}
