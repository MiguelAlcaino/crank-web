import { ERROR_UNKNOWN } from '@/utils/errorMessages'

export class IsSmsValidationCodeValidResponse {
  errorCode:
    | 'MobilePhoneAlreadyVerifiedError'
    | 'RequestSMSValidationNeededError'
    | 'SMSCodeValidatedSuccessfully'
    | 'SMSValidationCodeError'
    | 'UnknownError'

  constructor(
    typeName:
      | 'MobilePhoneAlreadyVerifiedError'
      | 'RequestSMSValidationNeededError'
      | 'SMSCodeValidatedSuccessfully'
      | 'SMSValidationCodeError'
      | 'UnknownError'
  ) {
    this.errorCode = typeName
  }

  get message(): string {
    switch (this.errorCode) {
      case 'SMSCodeValidatedSuccessfully':
        return 'Thank you. Your mobile number has been verified and updated successfully and you can proceed with your purchase now.'
      case 'SMSValidationCodeError':
        return 'Invalid code.'
      case 'MobilePhoneAlreadyVerifiedError':
        return 'Mobile phone number is already validated.'
      case 'RequestSMSValidationNeededError':
        return 'SMS Validation is required.'
      default:
        return ERROR_UNKNOWN
    }
  }

  get success(): boolean {
    return this.errorCode === 'SMSCodeValidatedSuccessfully'
  }
}
