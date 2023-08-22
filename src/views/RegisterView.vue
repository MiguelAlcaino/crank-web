<script lang="ts">
interface Country {
  code: string
  name: string
  states?: State[] | undefined
}

interface State {
  code: string
  name: string
}
</script>

<script setup lang="ts">
import { onMounted, reactive, ref, computed, inject } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, email, minLength, sameAs, maxLength, helpers } from '@vuelidate/validators'
import { GenderEnum, type RegisterUserInput, SiteEnum } from '@/gql/graphql'

import type { ApiService } from '@/services/apiService'
import { authService } from '@/services/authService'
import { appStore } from '@/stores/appStorage'
import router from '@/router'
import ModalComponent from '@/components/ModalComponent.vue'

const isSaving = ref(false)
const isLoggingIn = ref(false)
const successModalIsVisible = ref(false)
const errorModalIsVisible = ref(false)
const errorMessage = ref('')

const countries = ref([] as Country[])
const countryStates = ref([] as State[])

const formData = reactive({
  location: null,
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender: '',
  birthdate: '',
  country: 'AE',
  cityState: '',
  address1: '',
  address2: '',
  phone: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelationship: '',
  leaderboardUsername: '',
  acceptTermsAndConditions: false
})

const checkPass = helpers.regex(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)

const rules = computed(() => {
  return {
    location: {
      required: helpers.withMessage('Location is required', required)
    },
    firstName: {
      required: helpers.withMessage('First Name is required', required),
      maxLength: maxLength(50)
    },
    lastName: {
      required: helpers.withMessage('Last Name is required', required),
      maxLength: maxLength(50)
    },
    email: {
      required: helpers.withMessage('Email is required', required),
      email: helpers.withMessage('The email address is not valid', email)
    },
    password: {
      required: helpers.withMessage('Field is required', required),
      minLength: helpers.withMessage(
        'The password must contain at least 8 characters',
        minLength(8)
      ),
      checkPass: helpers.withMessage('The password must contain a letter and a number', checkPass)
    },
    confirmPassword: {
      required: helpers.withMessage('Field is required', required),
      sameAs: helpers.withMessage(
        'The password confirmation does not match',
        sameAs(formData.password)
      )
    },
    gender: {
      required: helpers.withMessage('Gender required', required)
    },
    birthdate: {
      required: helpers.withMessage('Date of Birth is required', required)
    },
    country: {
      required: helpers.withMessage('Country is required', required)
    },
    cityState: {
      required: helpers.withMessage('City/State is required', required)
    },
    address1: { maxLength: maxLength(255) },
    address2: { maxLength: maxLength(255) },
    phone: {
      required: helpers.withMessage(
        'Valid mobile number is required to receive the sms and redeem the trial package',
        required
      )
    },
    emergencyContactName: {
      required: helpers.withMessage('Emergency Contact Name is required', required)
    },
    emergencyContactPhone: {
      required: helpers.withMessage('Emergency contact number is required', required)
    },
    emergencyContactRelationship: {
      required: helpers.withMessage('Emergency contact relationship is required', required)
    },
    leaderboardUsername: {
      required: helpers.withMessage('Leaderboard Nickname is required', required)
    },
    acceptTermsAndConditions: {
      sameAs: helpers.withMessage('You must accept the terms and conditions', sameAs(true))
    }
  }
})

const v$ = useVuelidate(rules, formData)
const apiService = inject<ApiService>('gqlApiService')!

onMounted(() => {
  getCountries()
  getCountryStates('AE')
})

const submitForm = async () => {
  const isValid = await v$.value.$validate()

  if (isValid) {
    let gender: GenderEnum = GenderEnum.N

    if (formData.gender === 'M') gender = GenderEnum.M
    else if (formData.gender === 'F') gender = GenderEnum.F

    const input: RegisterUserInput = {
      address1: formData.address1 == '' ? '-' : formData.address1,
      address2: formData.address2,
      birthdate: formData.birthdate,
      city: formData.cityState,
      country: formData.country,
      email: formData.email,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactPhone: formData.emergencyContactPhone,
      emergencyContactRelationship: formData.emergencyContactRelationship,
      firstName: formData.firstName,
      gender: gender,
      lastName: formData.lastName,
      leaderboardUsername: formData.leaderboardUsername,
      password: formData.password,
      phone: formData.phone,
      state: formData.cityState,
      weight: null,
      zipCode: '0000'
    }

    isSaving.value = true
    const response = await apiService.registerUser(formData.location!, input)
    isSaving.value = false

    if (response === 'SuccessRegistration') {
      successModalIsVisible.value = true
    } else {
      if (response === 'PasswordMustContainLetterOrNumberException') {
        errorMessage.value = 'The password must contain a letter and a number.'
      } else if (response === 'MinimumPasswordLengthException') {
        errorMessage.value = 'The password must contain at least 8 characters.'
      } else if (response === 'RegisterUserAlreadyRegisteredException') {
        errorMessage.value =
          'Your email address is already registered with us. Please login directly to your account.'
      } else {
        errorMessage.value =
          "Ups! Sorry, we didn't see that coming!. Please try again or communicate with the team to resolve this issue."
      }

      errorModalIsVisible.value = true
    }
  } else {
    console.error('error form')
  }
}

const onChangeFirstName = async () => {
  formData.leaderboardUsername = formData.firstName
}

async function getCountries() {
  countries.value = (await apiService.getCountries()) as Country[]
}

async function getCountryStates(countryCode: string) {
  const country = await apiService.getCountry(countryCode)
  countryStates.value = country?.states as State[]
}

function onChangeCountry() {
  getCountryStates(formData.country)
}

//TODO: do you have to auto login? what happens if it fails?
async function login() {
  isLoggingIn.value = true

  try {
    await authService.login(formData.email, formData.password, appStore().site)
    await router.push({ name: 'home' })
  } catch (error) {
    console.log(error)
  } finally {
    isLoggingIn.value = false
  }
}
</script>

<template>
  <h1>Registration</h1>
  <h3>Location</h3>

  <form @submit.prevent="submitForm" autocomplete="off">
    <!-- location -->
    <div class="form-row">
      <div class="col-md-6 mb-3">
        <select class="custom-select" v-model="formData.location" required>
          <option :value="SiteEnum.Dubai">Dubai</option>
          <option :value="SiteEnum.AbuDhabi">Abu Dhabi</option>
        </select>
        <small
          v-for="error in v$.location.$errors"
          :key="error.$uid"
          class="form-text"
          style="color: red"
        >
          {{ error.$message }}
        </small>
      </div>
    </div>
    <hr />
    <h3>Profile Information</h3>
    <!-- email -->
    <div class="form-row">
      <div class="col-md-6 mb-3">
        <label for="emailRegistration">Email *</label>
        <input
          type="email"
          v-model="formData.email"
          class="form-control"
          id="emailRegistration"
          maxlength="200"
          placeholder="Email"
          required
        />
        <small
          v-for="error in v$.email.$errors"
          :key="error.$uid"
          class="form-text"
          style="color: red"
        >
          {{ error.$message }}
        </small>
      </div>
    </div>

    <div class="form-row">
      <!-- password -->
      <div class="col-md-6 mb-3">
        <label for="passwordRegistration">Password *</label>
        <input
          id="passwordRegistration"
          class="form-control"
          v-model="formData.password"
          type="password"
          placeholder="Password"
          maxlength="200"
          required
        />
        <small
          v-for="error in v$.password.$errors"
          :key="error.$uid"
          class="form-text"
          style="color: red"
        >
          {{ error.$message }}
        </small>
      </div>
      <!-- confirm Password -->
      <div class="col-md-6 mb-3">
        <label for="confirmPasswordRegistration">Confirm Password *</label>
        <input
          id="confirmPasswordRegistration"
          class="form-control"
          v-model="formData.confirmPassword"
          type="password"
          placeholder="Confirm Password"
          maxlength="200"
          required
        />
        <small
          v-for="error in v$.confirmPassword.$errors"
          :key="error.$uid"
          class="form-text"
          style="color: red"
        >
          {{ error.$message }}
        </small>
      </div>
    </div>
    <hr />
    <h3>Personal Information</h3>
    <div class="form-row">
      <!-- firstName -->
      <div class="col-md-6 mb-3">
        <label for="firstNameRegistration">First Name *</label>
        <input
          id="firstNameRegistration"
          class="form-control"
          v-model="formData.firstName"
          type="text"
          placeholder="First Name"
          maxlength="50"
          required
          v-on:input="onChangeFirstName"
        />
        <small
          v-for="error in v$.firstName.$errors"
          :key="error.$uid"
          class="form-text"
          style="color: red"
        >
          {{ error.$message }}
        </small>
      </div>
      <!-- lastName -->
      <div class="col-md-6 mb-3">
        <label for="lastNameRegistration">Last Name *</label>
        <input
          id="lastNameRegistration"
          class="form-control"
          v-model="formData.lastName"
          type="text"
          placeholder="Last Name"
          maxlength="50"
          required
        />
        <small
          v-for="error in v$.lastName.$errors"
          :key="error.$uid"
          class="form-text"
          style="color: red"
        >
          {{ error.$message }}
        </small>
      </div>
    </div>

    <!--gender-->
    <div class="form-row">
      <div class="col-md-6 mb-3">
        <label for="genderRegistration">Gender *</label>
        <select
          class="custom-select"
          v-model="formData.gender"
          id="genderRegistration"
          placeholder="Gender"
          required
        >
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
        <small
          v-for="error in v$.gender.$errors"
          :key="error.$uid"
          class="form-text"
          style="color: red"
        >
          {{ error.$message }}
        </small>
      </div>
    </div>

    <!--leaderboardUsername-->
    <div class="form-row">
      <div class="col-md-6 mb-3">
        <label for="leaderboardUsernameRegistration">Leaderboard Nickname *</label>
        <input
          id="leaderboardUsernameRegistration"
          class="form-control"
          v-model="formData.leaderboardUsername"
          type="text"
          placeholder="Leaderboard Nickname"
          maxlength="50"
          required
        />
        <small
          v-for="error in v$.leaderboardUsername.$errors"
          :key="error.$uid"
          class="form-text"
          style="color: red"
        >
          {{ error.$message }}
        </small>
      </div>
    </div>

    <!--birthdate-->
    <div class="form-row">
      <div class="col-md-6 mb-3">
        <label for="dateOfBirthRegistration">Date of Birth *</label>
        <input
          class="form-control"
          v-model="formData.birthdate"
          type="date"
          placeholder="Date of Birth *"
          id="dateOfBirthRegistration"
          required
        />
        <small
          v-for="error in v$.birthdate.$errors"
          :key="error.$uid"
          class="form-text"
          style="color: red"
        >
          {{ error.$message }}
        </small>
      </div>
    </div>

    <hr />
    <h3>Contact Information</h3>
    <!--country-->
    <div class="form-row">
      <div class="col-md-6 mb-3">
        <label for="countryRegistration">Country *</label>
        <select
          class="custom-select"
          v-model="formData.country"
          @change="onChangeCountry()"
          id="countryRegistration"
          required
        >
          <option v-for="(item, index) in countries" :key="index" :value="item.code">
            {{ item.name }}
          </option>
        </select>
        <small
          v-for="error in v$.country.$errors"
          :key="error.$uid"
          class="form-text"
          style="color: red"
        >
          {{ error.$message }}
        </small>
      </div>
      <!-- cityState -->
      <div class="col-md-6 mb-3">
        <label for="cityStateRegistration">City/State *</label>
        <select
          class="custom-select"
          v-model="formData.cityState"
          id="cityStateRegistration"
          required
        >
          <option v-for="(item, index) in countryStates" :key="index" :value="item.code">
            {{ item.name }}
          </option>
        </select>
        <small
          v-for="error in v$.cityState.$errors"
          :key="error.$uid"
          class="form-text"
          style="color: red"
        >
          {{ error.$message }}
        </small>
      </div>
    </div>

    <div class="form-row">
      <!--address1-->
      <div class="col-md-6 mb-3">
        <label for="address1Registration">Address Line 1</label>
        <input
          id="address1Registration"
          class="form-control"
          v-model="formData.address1"
          type="text"
          placeholder="Address Line 1"
          maxlength="255"
        />
        <small
          v-for="error in v$.address1.$errors"
          :key="error.$uid"
          class="form-text"
          style="color: red"
        >
          {{ error.$message }}
        </small>
      </div>
      <!--address2-->
      <div class="col-md-6 mb-3">
        <label for="address2Registration">Address Line 2</label>
        <input
          id="address2Registration"
          class="form-control"
          v-model="formData.address2"
          type="text"
          placeholder="Address Line 2"
          maxlength="255"
        />
        <small
          v-for="error in v$.address2.$errors"
          :key="error.$uid"
          class="form-text"
          style="color: red"
        >
          {{ error.$message }}
        </small>
      </div>
    </div>

    <div class="form-row">
      <!--phone-->
      <div class="col-md-6 mb-3">
        <label for="mobileNumberRegistration">Mobile Number *</label>
        <input
          id="mobileNumberRegistration"
          class="form-control"
          v-model="formData.phone"
          type="text"
          placeholder="Mobile Number"
          maxlength="20"
          required
        />
        <small
          v-for="error in v$.phone.$errors"
          :key="error.$uid"
          class="form-text"
          style="color: red"
        >
          {{ error.$message }}
        </small>
      </div>
    </div>

    <div class="form-row">
      <!-- emergencyContactName -->
      <div class="col-md-6 mb-3">
        <label for="emergencyContactNameRegistration">Emergency Contact Name *</label>
        <input
          id="emergencyContactNameRegistration"
          class="form-control"
          v-model="formData.emergencyContactName"
          type="text"
          placeholder="Emergency Contact Name"
          maxlength="100"
          required
        />
        <small
          v-for="error in v$.emergencyContactName.$errors"
          :key="error.$uid"
          class="form-text"
          style="color: red"
        >
          {{ error.$message }}
        </small>
      </div>
      <!--emergencyContactPhone-->
      <div class="col-md-6 mb-3">
        <label for="emergencyContactPhoneRegistration">Emergency Contact Number *</label>
        <input
          id="emergencyContactPhoneRegistration"
          class="form-control"
          v-model="formData.emergencyContactPhone"
          type="text"
          placeholder="Emergency Contact Number"
          maxlength="100"
          required
        />
        <small
          v-for="error in v$.emergencyContactPhone.$errors"
          :key="error.$uid"
          class="form-text"
          style="color: red"
        >
          {{ error.$message }}
        </small>
      </div>
      <!-- emergencyContactRelationship -->
      <div class="col-md-6 mb-3">
        <label for="emergencyContactRelationshipRegistration"
          >Emergency Contact Relationship *</label
        >
        <select
          class="custom-select"
          v-model="formData.emergencyContactRelationship"
          id="emergencyContactRelationshipRegistration"
          required
        >
          <option value="Friend">Friend</option>
          <option value="Relative">Relative</option>
          <option value="Relative">Other</option>
        </select>
        <small
          v-for="error in v$.emergencyContactRelationship.$errors"
          :key="error.$uid"
          class="form-text"
          style="color: red"
        >
          {{ error.$message }}
        </small>
      </div>
    </div>

    <!-- acceptTermsAndConditions -->
    <div class="form-row">
      <div class="col-md-12 mb-3">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="formData.acceptTermsAndConditions"
            id="acceptTermsAndConditionsRegistration"
          />
          <label class="form-check-label" for="acceptTermsAndConditionsRegistration">
            I understand and accept the
            <b
              ><a href="https://www.crank-fit.com/terms-conditions" target="_blank"
                >Terms & Conditions</a
              ></b
            >
          </label>
          <small
            v-for="error in v$.acceptTermsAndConditions.$errors"
            :key="error.$uid"
            class="form-text"
            style="color: red"
          >
            {{ error.$message }}
          </small>
        </div>
      </div>
    </div>

    <!--submit button-->
    <div class="form-row">
      <div class="col-md-12 mb-3">
        <button class="btn btn-primary" type="submit" :disabled="isSaving">
          Next <span class="spinner-border spinner-border-sm" v-if="isSaving"></span>
        </button>
      </div>
    </div>
  </form>

  <!-- Error Modal -->
  <ModalComponent
    v-if="errorModalIsVisible"
    title="Error"
    :message="errorMessage"
    :cancel-text="null"
    @on-ok="errorModalIsVisible = false"
  >
  </ModalComponent>

  <!-- Success Modal -->
  <ModalComponent
    v-if="successModalIsVisible"
    title="Success"
    message="Your account has been successfully created."
    :cancel-text="null"
    :closable="false"
    @on-ok="login()"
    :ok-loading="isLoggingIn"
  >
  </ModalComponent>
</template>
