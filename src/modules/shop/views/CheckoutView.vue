<template>
  <div class="payment-form-container">
    <h2>Formulario de Pago</h2>
    <form @submit.prevent="handleSubmit" class="payment-form">
      <div class="form-group">
        <label for="cardNumber">Número de Tarjeta</label>
        <input
          id="cardNumber"
          v-model="cardData.cardNumber"
          type="text"
          placeholder="XXXX XXXX XXXX XXXX"
          @input="formatCardNumber"
          maxlength="19"
          :class="{ error: errors.cardNumber }"
        />
        <span v-if="errors.cardNumber" class="error-message">{{ errors.cardNumber }}</span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="expiryDate">Fecha de Expiración</label>
          <input
            id="expiryDate"
            v-model="cardData.expiryDate"
            type="text"
            placeholder="MM/AA"
            @input="formatExpiryDate"
            maxlength="5"
            :class="{ error: errors.expiryDate }"
          />
          <span v-if="errors.expiryDate" class="error-message">{{ errors.expiryDate }}</span>
        </div>

        <div class="form-group">
          <label for="cvv">CVV</label>
          <input
            id="cvv"
            v-model="cardData.cvv"
            type="text"
            placeholder="XXX"
            maxlength="4"
            :class="{ error: errors.cvv }"
          />
          <span v-if="errors.cvv" class="error-message">{{ errors.cvv }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="cardholderName">Nombre del Titular</label>
        <input
          id="cardholderName"
          v-model="cardData.cardholderName"
          type="text"
          placeholder="Nombre completo"
          :class="{ error: errors.cardholderName }"
        />
        <span v-if="errors.cardholderName" class="error-message">{{ errors.cardholderName }}</span>
      </div>

      <div class="checkbox-group">
        <input type="checkbox" id="saveCard" v-model="cardData.saveForFuture" />
        <label for="saveCard" class="checkbox-label">Guardar esta tarjeta para pagos futuros</label>
      </div>

      <div class="card-type" v-if="cardType">
        <span>Tipo de tarjeta: {{ cardType }}</span>
      </div>

      <button type="submit" class="submit-button" :disabled="isSubmitting">
        {{ isSubmitting ? 'Procesando...' : 'Pagar' }}
      </button>
    </form>

    <div v-if="savedCards.length > 0" class="saved-cards-section">
      <h3>Tarjetas Guardadas</h3>
      <div
        v-for="(card, index) in savedCards"
        :key="index"
        class="saved-card"
        @click="selectSavedCard(card)"
      >
        <div class="saved-card-info">
          <div class="saved-card-type">{{ card.cardType }}</div>
          <div class="saved-card-number">**** **** **** {{ card.lastFourDigits }}</div>
          <div class="saved-card-expiry">Expira: {{ card.expiryDate }}</div>
        </div>
        <button class="remove-card-btn" @click.stop="removeSavedCard(index)">×</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'

interface CardData {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
  saveForFuture: boolean
}

interface FormErrors {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
}

interface SavedCard {
  cardType: string
  lastFourDigits: string
  expiryDate: string
  cardholderName: string
}

const cardData = reactive<CardData>({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: '',
  saveForFuture: false
})

const errors = reactive<FormErrors>({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: ''
})

const isSubmitting = ref(false)
const savedCards = ref<SavedCard[]>([])

// Cargar tarjetas guardadas al montar el componente
onMounted(() => {
  const storedCards = localStorage.getItem('savedPaymentCards')
  if (storedCards) {
    savedCards.value = JSON.parse(storedCards)
  }
})

// Guardar tarjeta en localStorage
const saveCardToStorage = (card: SavedCard) => {
  const updatedCards = [...savedCards.value, card]
  savedCards.value = updatedCards
  localStorage.setItem('savedPaymentCards', JSON.stringify(updatedCards))
}

// Eliminar tarjeta guardada
const removeSavedCard = (index: number) => {
  const updatedCards = [...savedCards.value]
  updatedCards.splice(index, 1)
  savedCards.value = updatedCards
  localStorage.setItem('savedPaymentCards', JSON.stringify(updatedCards))
}

// Seleccionar tarjeta guardada
const selectSavedCard = (card: SavedCard) => {
  cardData.cardNumber = `**** **** **** ${card.lastFourDigits}`
  cardData.expiryDate = card.expiryDate
  cardData.cardholderName = card.cardholderName
  cardData.cvv = '' // Por seguridad, siempre se debe pedir el CVV
}

const cardType = computed(() => {
  const number = cardData.cardNumber.replace(/\s/g, '')
  if (number.startsWith('4')) {
    return 'Visa'
  } else if (/^5[1-5]/.test(number)) {
    return 'MasterCard'
  } else if (/^3[47]/.test(number)) {
    return 'American Express'
  } else if (/^6(?:011|5)/.test(number)) {
    return 'Discover'
  } else {
    return ''
  }
})

const formatCardNumber = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')

  // Add spaces every 4 digits
  if (value.length > 0) {
    value = value.match(new RegExp('.{1,4}', 'g'))?.join(' ') || ''
  }

  cardData.cardNumber = value
}

const formatExpiryDate = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')

  if (value.length > 2) {
    value = value.substring(0, 2) + '/' + value.substring(2)
  }

  cardData.expiryDate = value
}

const validateForm = (): boolean => {
  let isValid = true

  // Reset errors
  errors.cardNumber = ''
  errors.expiryDate = ''
  errors.cvv = ''
  errors.cardholderName = ''

  // Validate card number - allow masked numbers for saved cards
  const cardNumberClean = cardData.cardNumber.replace(/\s/g, '')
  if (!cardNumberClean) {
    errors.cardNumber = 'El número de tarjeta es requerido'
    isValid = false
  } else if (!cardNumberClean.startsWith('****') && !/^\d{13,19}$/.test(cardNumberClean)) {
    errors.cardNumber = 'El número de tarjeta debe tener entre 13 y 19 dígitos'
    isValid = false
  } else if (!cardNumberClean.startsWith('****') && !luhnCheck(cardNumberClean)) {
    errors.cardNumber = 'Número de tarjeta inválido'
    isValid = false
  }

  // Validate expiry date
  if (!cardData.expiryDate) {
    errors.expiryDate = 'La fecha de expiración es requerida'
    isValid = false
  } else {
    const [month, year] = cardData.expiryDate.split('/')
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1

    if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
      errors.expiryDate = 'Formato inválido (MM/AA)'
      isValid = false
    } else if (parseInt(month) < 1 || parseInt(month) > 12) {
      errors.expiryDate = 'Mes inválido'
      isValid = false
    } else if (
      parseInt(year) < currentYear ||
      (parseInt(year) === currentYear && parseInt(month) < currentMonth)
    ) {
      errors.expiryDate = 'La tarjeta ha expirado'
      isValid = false
    }
  }

  // Validate CVV
  if (!cardData.cvv) {
    errors.cvv = 'El CVV es requerido'
    isValid = false
  } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
    errors.cvv = 'El CVV debe tener 3 o 4 dígitos'
    isValid = false
  }

  // Validate cardholder name
  if (!cardData.cardholderName.trim()) {
    errors.cardholderName = 'El nombre del titular es requerido'
    isValid = false
  }

  return isValid
}

// Luhn algorithm for card number validation
const luhnCheck = (cardNumber: string): boolean => {
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

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // Aquí iría la lógica para procesar el pago
    console.log('Procesando pago con los siguientes datos:', {
      cardNumber: cardData.cardNumber,
      expiryDate: cardData.expiryDate,
      cvv: cardData.cvv,
      cardholderName: cardData.cardholderName,
      cardType: cardType.value,
      saveForFuture: cardData.saveForFuture
    })

    // Simular una respuesta del servidor
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Guardar la tarjeta si el usuario ha seleccionado la opción
    if (cardData.saveForFuture && !cardData.cardNumber.startsWith('****')) {
      const lastFourDigits = cardData.cardNumber.replace(/\s/g, '').slice(-4)
      const savedCard: SavedCard = {
        cardType: cardType.value,
        lastFourDigits,
        expiryDate: cardData.expiryDate,
        cardholderName: cardData.cardholderName
      }
      saveCardToStorage(savedCard)
    }

    alert('¡Pago procesado con éxito!')

    // Resetear el formulario
    cardData.cardNumber = ''
    cardData.expiryDate = ''
    cardData.cvv = ''
    cardData.cardholderName = ''
    cardData.saveForFuture = false
  } catch (error) {
    console.error('Error al procesar el pago:', error)
    alert('Hubo un error al procesar el pago. Por favor, inténtalo de nuevo.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped>
.payment-form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h2,
h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
}

label {
  font-size: 14px;
  margin-bottom: 5px;
  color: #555;
}

input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #3f51b5;
}

input.error {
  border-color: #f44336;
}

.error-message {
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.checkbox-group input[type='checkbox'] {
  margin-right: 8px;
  width: 18px;
  height: 18px;
}

.checkbox-label {
  font-size: 14px;
  color: #555;
  margin-bottom: 0;
}

.card-type {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}

.submit-button {
  margin-top: 16px;
  padding: 12px;
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #2f2f2f;
}

.submit-button:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.saved-cards-section {
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.saved-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.saved-card:hover {
  background-color: #f5f5f5;
}

.saved-card-info {
  display: flex;
  flex-direction: column;
}

.saved-card-type {
  font-weight: bold;
  color: #333;
}

.saved-card-number {
  font-size: 14px;
  color: #555;
}

.saved-card-expiry {
  font-size: 12px;
  color: #777;
}

.remove-card-btn {
  background: none;
  border: none;
  color: #f44336;
  font-size: 20px;
  cursor: pointer;
  padding: 0 8px;
}

.remove-card-btn:hover {
  color: #d32f2f;
}
</style>
