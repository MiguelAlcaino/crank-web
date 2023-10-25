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

export function secondsToMMSS(seconds?: number): string {
  if (!seconds) return '00:00'

  const minutes = Math.floor(seconds / 60)

  let minutesStr = minutes.toString()
  if (minutesStr.length < 2) minutesStr = '0' + minutesStr

  let secondsStr = (seconds - minutes * 60).toString()
  if (secondsStr.length < 2) secondsStr = '0' + secondsStr

  return minutesStr + ':' + secondsStr
}
