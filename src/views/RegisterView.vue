<script setup lang="ts">
import { onMounted, reactive, ref, computed, inject } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, email, minLength, sameAs, maxLength, helpers } from '@vuelidate/validators'
import { GenderEnum, type RegisterUserInput, type Country, type State, SiteEnum } from '@/gql/graphql'

import type { ApiService } from '@/services/apiService'
import { authService } from '@/services/authService'
import { appStore } from '@/stores/appStorage'
import router from '@/router'

const isSaving = ref(false)
const isLoggingIn = ref(false)
const countries = ref([] as Country[])
const countryStates = ref([] as State[])
const location = ref(SiteEnum.Dubai)

const formData = reactive({
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
    isSaving.value = true

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

    const response = await apiService.registerUser(location.value, input)
    isSaving.value = false

    if (response === 'SuccessRegistration') {
      //logging
      isLoggingIn.value = true

      try {
        await authService.login(formData.email, formData.password, appStore().site)
        await router.push({ name: 'home' })
      } catch (error) {
        console.log(error)
      }

      isLoggingIn.value = false
    } else if (response === 'PasswordMustContainLetterOrNumberException') {
      console.error('Error registering user', 'The password must contain a letter and a number')
    } else if (response === 'MinimumPasswordLengthException') {
      console.error('Error registering user', 'The password must contain at least 8 characters')
    } else if (response === 'RegisterUserAlreadyRegisteredException') {
      console.error('ERROR', 'Email address already registered')
    } else {
      console.error(
        'Error registering user',
        "Ups! Sorry, we didn't see that coming!. Please try again or communicate with the team to resolve this issue."
      )
    }
  } else {
    console.error('error form')
  }
}

const onChangeFirstName = async () => {
  formData.leaderboardUsername = formData.firstName
}

async function getCountries() {
  countries.value = await apiService.getCountries()
}

async function getCountryStates(countryCode: string) {
  const country = await apiService.getCountry(countryCode)
  countryStates.value = country?.states as State[]
}

function onChangeCountry() {
  getCountryStates(formData.country)
}
</script>

<template>
  <form @submit.prevent="submitForm" autocomplete="off">
    <h1>Registration</h1>
    <h3>Location</h3>
    <div class="field">
      <p>
        <select class="input" v-model="location" disabled>      
          <option :value="SiteEnum.Dubai">Dubai</option>
          <option :value="SiteEnum.AbuDhabi">Abu Dhabi</option>
        </select>
      </p> 
    </div>
    <h3>Profile Information</h3>
    <!--email-->
    <div class="field">
      <p>
        <input
          class="input"
          v-model="formData.email"
          type="text"
          placeholder="Email *"
          maxlength="200"
        />
      </p>
      <p>
        <span v-for="error in v$.email.$errors" :key="error.$uid" style="color: red">{{
          error.$message
        }}</span>
      </p>
    </div>
    <!--password-->
    <div class="field">
      <p>
        <input
          class="input"
          v-model="formData.password"
          type="password"
          placeholder="Password *"
          maxlength="200"
        />
      </p>
      <p>
        <span v-for="error in v$.password.$errors" :key="error.$uid" style="color: red">{{
          error.$message
        }}</span>
      </p>
    </div>
    <!--confirmPassword-->
    <div class="field">
      <p>
        <input
          class="input"
          v-model="formData.confirmPassword"
          type="password"
          placeholder="Confirm Password *"
          maxlength="200"
        />
      </p>
      <p>
        <span v-for="error in v$.confirmPassword.$errors" :key="error.$uid" style="color: red">{{
          error.$message
        }}</span>
      </p>
    </div>

    <h3>Profile Information</h3>
    <!--firstName-->
    <div class="field">
      <p>
        <input
          class="input"
          v-model="formData.firstName"
          type="text"
          placeholder="First Name *"
          maxlength="50"
          v-on:input="onChangeFirstName"
        />
      </p>
      <p>
        <span v-for="error in v$.firstName.$errors" :key="error.$uid" style="color: red">{{
          error.$message
        }}</span>
      </p>
    </div>
    <!--lastName-->
    <div class="field">
      <p>
        <input
          class="input"
          v-model="formData.lastName"
          type="text"
          placeholder="Last Name *"
          maxlength="50"
        />
      </p>
      <p>
        <span v-for="error in v$.lastName.$errors" :key="error.$uid" style="color: red">{{
          error.$message
        }}</span>
      </p>
    </div>
    <!--gender-->
    <div class="field">
      <p>
        <select class="input" v-model="formData.gender">
          <option value="" disabled>Gender *</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </p>
      <p>
        <span v-for="error in v$.gender.$errors" :key="error.$uid" style="color: red">{{
          error.$message
        }}</span>
      </p>
    </div>
    <!--leaderboardUsername-->
    <div class="field">
      <p>
        <input
          class="input"
          v-model="formData.leaderboardUsername"
          type="text"
          placeholder="Leaderboard Nickname *"
          maxlength="50"
        />
      </p>
      <p>
        <span
          v-for="error in v$.leaderboardUsername.$errors"
          :key="error.$uid"
          style="color: red"
          >{{ error.$message }}</span
        >
      </p>
    </div>
    <!--birthdate-->
    <div class="field">
      <p>
        <input
          class="input"
          v-model="formData.birthdate"
          type="date"
          placeholder="Date of Birth *"
        />
      </p>
      <p>
        <span v-for="error in v$.birthdate.$errors" :key="error.$uid" style="color: red">{{
          error.$message
        }}</span>
      </p>
    </div>

    <h3>Contact Information</h3>
    <!--country-->
    <div class="field">
      <p>
        <select class="input" v-model="formData.country" @change="onChangeCountry()">
          <option value="" disabled>Country *</option>
          <option v-for="(item, index) in countries" :key="index" :value="item.code">
            {{ item.name }}
          </option>
        </select>
      </p>
      <p>
        <span v-for="error in v$.country.$errors" :key="error.$uid" style="color: red">{{
          error.$message
        }}</span>
      </p>
    </div>
    <!--cityState-->
    <div class="field">
      <p>
        <select class="input" v-model="formData.cityState">
          <option value="" disabled>City/State *</option>
          <option v-for="(item, index) in countryStates" :key="index" :value="item.code">
            {{ item.name }}
          </option>
        </select>
      </p>
      <p>
        <span v-for="error in v$.cityState.$errors" :key="error.$uid" style="color: red">{{
          error.$message
        }}</span>
      </p>
    </div>
    <!--address1-->
    <div class="field">
      <p>
        <input
          class="input"
          v-model="formData.address1"
          type="text"
          placeholder="Address Line 1"
          maxlength="255"
        />
      </p>
      <p>
        <span v-for="error in v$.address1.$errors" :key="error.$uid" style="color: red">{{
          error.$message
        }}</span>
      </p>
    </div>
    <!--address2-->
    <div class="field">
      <p>
        <input
          class="input"
          v-model="formData.address2"
          type="text"
          placeholder="Address Line 2"
          maxlength="255"
        />
      </p>
      <p>
        <span v-for="error in v$.address2.$errors" :key="error.$uid" style="color: red">{{
          error.$message
        }}</span>
      </p>
    </div>
    <!--phone-->
    <div class="field">
      <p>
        <input
          class="input"
          v-model="formData.phone"
          type="text"
          placeholder="Mobile Number *"
          maxlength="20"
        />
      </p>
      <p>
        <span v-for="error in v$.phone.$errors" :key="error.$uid" style="color: red">{{
          error.$message
        }}</span>
      </p>
    </div>
    <!--emergencyContactName-->
    <div class="field">
      <p>
        <input
          class="input"
          v-model="formData.emergencyContactName"
          type="text"
          placeholder="Emergency Contact Name *"
          maxlength="100"
        />
      </p>
      <p>
        <span
          v-for="error in v$.emergencyContactName.$errors"
          :key="error.$uid"
          style="color: red"
          >{{ error.$message }}</span
        >
      </p>
    </div>
    <!--emergencyContactPhone-->
    <div class="field">
      <p>
        <input
          class="input"
          v-model="formData.emergencyContactPhone"
          type="text"
          placeholder="Emergency Contact Number *"
          maxlength="100"
        />
      </p>
      <p>
        <span
          v-for="error in v$.emergencyContactPhone.$errors"
          :key="error.$uid"
          style="color: red"
          >{{ error.$message }}</span
        >
      </p>
    </div>
    <!--emergencyContactRelationship-->
    <div class="field">
      <p>
        <select class="input" v-model="formData.emergencyContactRelationship">
          <option value="" disabled>Emergency Contact Relationship *</option>
          <option value="Friend">Friend</option>
          <option value="Relative">Relative</option>
          <option value="Relative">Other</option>
        </select>
      </p>
      <p>
        <span
          v-for="error in v$.emergencyContactRelationship.$errors"
          :key="error.$uid"
          style="color: red"
          >{{ error.$message }}</span
        >
      </p>
    </div>
    <!--acceptTermsAndConditions-->
    <div class="field">
      <label>
        <input type="checkbox" v-model="formData.acceptTermsAndConditions" />
        I understand and accept the
        <b
          ><a href="https://www.crank-fit.com/terms-conditions" target="_blank"
            >Terms & Conditions</a
          ></b
        >
      </label>
      <p>
        <span
          v-for="error in v$.acceptTermsAndConditions.$errors"
          :key="error.$uid"
          style="color: red"
          >{{ error.$message }}</span
        >
      </p>
    </div>

    <!--submit button-->
    <button type="submit" :disabled="isSaving">Next</button>
  </form>
</template>
