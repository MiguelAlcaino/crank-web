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
        return 'The submitted mobile number is invalid. Please try again with a valid mobile number.'
      case 'MobilePhoneAlreadyVerifiedError':
        return 'Your mobile number is already verified. Please proceed with your purchase.'
      default:
        return ERROR_UNKNOWN
    }
  }

  get success(): boolean {
    return this.errorCode === 'SuccessfulRequestSMSValidation'
  }
}
