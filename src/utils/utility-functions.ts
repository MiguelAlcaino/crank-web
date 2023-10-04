export function getFormattedPhoneNumber(phoneNumber?: string): string {
  if (phoneNumber) {
    phoneNumber = phoneNumber.replace(' ', '').replace(/\D/g, '')

    if (!isNumber(phoneNumber)) return ''

    return '+' + phoneNumber
  } else return ''
}
function isNumber(value?: string | number): boolean {
  return value != null && value !== '' && !isNaN(Number(value.toString()))
}
