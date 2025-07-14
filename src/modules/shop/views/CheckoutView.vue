<script setup lang="ts">
import cardsAccepted from '../assets/images/cards_accepted.png'
import protectedByPayfort from '../assets/images/protected_by_payfort.png'
import visaCheckout from '../assets/images/visa_checkout.jpg'
</script>

<template>
  <div>
    <div class="main-container">
      <a href="#" class="back-arrow"><i class="fas fa-chevron-left"></i></a>

      <h2 class="header-title">PAYMENT DETAILS</h2>
      <p class="header-subtitle">LOGGED IN AS CHRISTINA SALIBI</p>

      <div class="purchase-summary">
        <h5>YOU ARE BUYING:</h5>
        <h5>1 SESSION / TRIAL PACK / 5 SMOOTHIES</h5>
        <p>AED XXXX</p>
        <span class="item-count">3 items</span>
      </div>

      <p class="section-title">SELECT YOUR PAYMENT OPTION</p>

      <div class="payment-form-container">
        <div class="payment-option-header">
          <input type="radio" id="newCard" name="paymentMethod" checked />
          <label for="newCard">PAY WITH A NEW CARD</label>
        </div>
        <div class="form-row">
          <div class="form-group col-6">
            <input type="text" class="form-control" placeholder="NAME" />
          </div>
          <div class="form-group col-6">
            <input type="text" class="form-control" placeholder="SURNAME" />
          </div>
        </div>
        <div class="form-group">
          <input type="text" class="form-control" placeholder="CARD NUMBER" />
        </div>
        <div class="form-row">
          <div class="form-group col-4">
            <input type="text" class="form-control" placeholder="MONTH" />
          </div>
          <div class="form-group col-4">
            <input type="text" class="form-control" placeholder="YEAR" />
          </div>
          <div class="form-group col-4">
            <input type="text" class="form-control" placeholder="CVV" />
          </div>
        </div>
      </div>

      <p class="section-title mt-4">PAY WITH YOUR DIGITAL WALLET</p>
      <div class="digital-wallet-container">
        <input type="radio" id="digitalWallet" name="paymentMethod" />
        <label for="digitalWallet">PAY WITH</label>
        <img :src="visaCheckout" alt="Visa Checkout" class="visa-checkout-logo" />
      </div>
    </div>

    <footer class="payment-footer">
      <button class="pay-now-btn">PAY NOW</button>
      <div class="footer-disclaimer">
        <span>WE ACCEPT PAYMENTS ONLINE USING VISA AND MASTERCARD CREDIT/DEBIT CARD IN AED</span>
      </div>
      <div class="payment-logos">
        <img :src="cardsAccepted" alt="Cards Accepted" />
        <img :src="protectedByPayfort" alt="Protected by Payfort" />
      </div>
    </footer>
  </div>
</template>
<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style>
body {
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
  overflow-x: hidden;
}
</style>

<style scoped>
.main-container {
  padding: 1.5rem 1.5rem 250px;
}

.back-arrow {
  position: absolute;
  top: 2rem;
  left: 1.5rem;
  font-size: 1.2rem;
  color: #000;
}

.header-title {
  font-weight: 900;
  color: #000;
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
  font-size: 2.5rem;
  text-align: center;
  margin-top: 2rem;
}

.header-subtitle {
  color: #6c757d;
  font-size: 0.9rem;
  letter-spacing: 1px;
  text-align: center;
  margin-bottom: 1.5rem;
}

.purchase-summary {
  background-color: #000;
  color: #fff;
  padding: 1.5rem;
  margin: 1.5rem -1.5rem;
  text-align: center;
}

.purchase-summary h5 {
  font-size: 1rem;
  font-weight: bold;
}

.purchase-summary p {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ff8c69;
  margin: 0.5rem 0;
}

.purchase-summary .item-count {
  font-size: 0.8rem;
  color: #adb5bd;
}

.section-title {
  color: #ff8c69;
  font-weight: bold;
  font-size: 0.9rem;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.payment-form-container,
.digital-wallet-container {
  background-color: #f7f8fa;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
}

.payment-option-header,
.digital-wallet-container {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.payment-option-header label,
.digital-wallet-container label {
  margin-bottom: 0;
  cursor: pointer;
}

.payment-option-header input,
.digital-wallet-container input {
  width: 20px;
  height: 20px;
  margin-right: 1rem;
  accent-color: #ff8c69;
}

.form-control {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem 1rem;
  font-size: 0.9rem;
  font-weight: bold;
}

.form-group {
  margin-bottom: 0.75rem;
}

.toggle-switch input[type='checkbox'] {
  height: 0;
  width: 0;
  visibility: hidden;
}

.toggle-switch label {
  cursor: pointer;
  width: 50px;
  height: 28px;
  background: #e0e0e0;
  display: block;
  border-radius: 100px;
  position: relative;
  margin: 0;
}

.toggle-switch label:after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  background: #fff;
  border-radius: 90px;
  transition: 0.3s;
}

.toggle-switch input:checked + label {
  background: #ff8c69;
}

.toggle-switch input:checked + label:after {
  left: calc(100% - 3px);
  transform: translateX(-100%);
}

.visa-checkout-logo {
  height: 30px;
  margin-left: 0.5rem;
}

.payment-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
  z-index: 1000;
}

.pay-now-btn {
  width: 100%;
  background-color: #ff8c69;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 1rem;
}

.footer-disclaimer {
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 0.7rem;
  color: #888;
  margin-bottom: 1rem;
}

.footer-disclaimer::before,
.footer-disclaimer::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e0e0e0;
}

.footer-disclaimer span {
  padding: 0 10px;
}

.payment-logos {
  display: flex;
  justify-content: center;
  align-items: center;
}

.payment-logos img {
  max-height: 50px;
  width: auto;
}
</style>
