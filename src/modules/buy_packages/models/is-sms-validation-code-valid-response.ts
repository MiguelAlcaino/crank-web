import { ERROR_UNKNOWN } from '@/utils/errorMessages'

export class IsSmsValidationCodeValidResponse {
  code:
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
    this.code = typeName
  }

  get message(): string {
    switch (this.code) {
      case 'SMSCodeValidatedSuccessfully':
        return 'Thank you. Your mobile number has been verified and updated successfully and you can proceed with your purchase now.'
      case 'SMSValidationCodeError':
        return 'The code provided is invalid. Please try again.'
      case 'MobilePhoneAlreadyVerifiedError':
        return 'Your mobile number is already verified. Please proceed with your purchase.'
      case 'RequestSMSValidationNeededError':
        return 'Your phone number is not verified yet, please verify it.'
      default:
        return ERROR_UNKNOWN
    }
  }

  get success(): boolean {
    return this.code === 'SMSCodeValidatedSuccessfully'
  }
}
