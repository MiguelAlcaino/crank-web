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

/**
 * Formats a numeric value into a currency string based on a given locale and currency code.
 * It's robust against null, undefined, or non-numeric inputs.
 *
 * @param price The numeric value to format. Can be null or undefined.
 * @param currency The 3-letter ISO currency code (e.g., 'AED', 'USD', 'EUR').
 * @param locale A locale string (e.g., 'en-AE', 'en-US', 'ar-AE'). Defaults to 'en-AE' for your project context.
 * @returns A formatted currency string (e.g., "AED 1,250.50"). Returns a formatted zero if the price is invalid.
 */
export const formatPrice = (
  price: number | null | undefined,
  currency: string = 'AED',
  locale: string = 'en-AE'
): string => {
  // 1. Handle invalid input gracefully.
  // If price is null, undefined, or not a number, treat it as 0.
  const numericPrice = typeof price === 'number' && !isNaN(price) ? price : 0

  try {
    // 2. Use the Intl.NumberFormat API for powerful, native formatting.
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
      // You can add more options here if needed, e.g.:
      // minimumFractionDigits: 2,
      // maximumFractionDigits: 2,
    }).format(numericPrice)
  } catch (error) {
    // 3. Catch potential errors, like an invalid currency code.
    console.error(`[formatPrice] Error formatting price:`, {
      price: numericPrice,
      currency,
      locale,
      error
    })
    // Return a simple, unformatted fallback so the UI doesn't crash.
    return `${currency} ${numericPrice.toFixed(2)}`
  }
}

// Convert date format from MM/YY to YYMM
export const convertDateFormat = (dateString: string): string => {
  const [month, year] = dateString.split('/')
  return year + month
}
