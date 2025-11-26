import type { CardData } from '@/modules/shop//interfaces/card-data'
import { convertDateFormat } from '@/modules/shop/utils/shop-utils'

/**
 * Manages the creation, manipulation, and submission of the Payfort payment form.
 */
export function createPayfortFormManager(formHtml: string) {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = formHtml

  const formElement = tempDiv.querySelector('form')

  if (!formElement) {
    throw new Error('Payfort form element not found in the provided HTML.')
  }

  const addHiddenInput = (name: string, value: string) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    formElement.appendChild(input)
  }

  /**
   * Appends the user's credit card data as hidden inputs to the form.
   * @param cardData The reactive card data object from the form.
   */
  const addCardData = (cardData: CardData) => {
    addHiddenInput('card_holder_name', cardData.cardholderName)
    addHiddenInput('card_number', cardData.cardNumber.replace(/\s/g, ''))
    addHiddenInput('expiry_date', convertDateFormat(cardData.expiryDate))
    addHiddenInput('card_security_code', cardData.cvv)
    addHiddenInput('remember_me', cardData.saveForFuture ? 'YES' : 'NO')
  }

  /**
   * Appends the form to the body and submits it.
   */
  const submit = () => {
    formElement.style.display = 'none' // Hide the form instead of using visibility
    document.body.appendChild(formElement)
    HTMLFormElement.prototype.submit.call(formElement)
  }

  return {
    addCardData,
    submit
  }
}
