import { ERROR_UNKNOWN } from '@/utils/errorMessages'

export class SmsValidationResponse {
  errorCode:
    | 'MobilePhoneAlreadyVerifiedError'
    | 'MobilePhoneNotValidError'
    | 'SuccessfulRequestSMSValidation'
    | 'UnknownError'

  constructor(
    typeName:
      | 'MobilePhoneAlreadyVerifiedError'
      | 'MobilePhoneNotValidError'
      | 'SuccessfulRequestSMSValidation'
      | 'UnknownError'
  ) {
    this.errorCode = typeName
  }

  get message(): string {
    switch (this.errorCode) {
      case 'SuccessfulRequestSMSValidation':
        return 'SMS sent successfully.'
      case 'MobilePhoneNotValidError':
        return 'Invalid phone number.'
      case 'MobilePhoneAlreadyVerifiedError':
        return 'This mobile phone number has been already verified.'
      default:
        return ERROR_UNKNOWN
    }
  }

  get success(): boolean {
    return this.errorCode === 'SuccessfulRequestSMSValidation'
  }
}
