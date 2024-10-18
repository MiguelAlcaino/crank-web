import { ERROR_UNKNOWN } from '@/utils/errorMessages'

export class SmsValidationResponse {
  code:
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
    this.code = typeName
  }

  get message(): string {
    switch (this.code) {
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
    return this.code === 'SuccessfulRequestSMSValidation'
  }
}
