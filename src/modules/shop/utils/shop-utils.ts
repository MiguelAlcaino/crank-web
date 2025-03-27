// Luhn algorithm for card number validation
export const luhnCheck = (cardNumber: string): boolean => {
  let sum = 0
  let shouldDouble = false

  // Loop through values starting from the rightmost digit
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i))

    if (shouldDouble) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}

// Format price to AED
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED'
  }).format(price)
}

// Convert date format from MM/YY to YYMM
export const convertDateFormat = (dateString: string): string => {
  const [month, year] = dateString.split('/')
  return year + month
}
