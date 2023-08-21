<script setup lang="ts">
import { onMounted, reactive, ref, computed, inject } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, maxLength, helpers, minValue } from '@vuelidate/validators'
import { GenderEnum, type Country, type State, type UserInput } from '@/gql/graphql'
import type { ApiService } from '@/services/apiService'

import ModalComponent from '@/components/ModalComponent.vue'

const isSaving = ref(false)
const countries = ref([] as Country[])
const countryStates = ref([] as State[])

const formData = reactive({
  firstName: '',
  lastName: '',
  gender: '',
  birthdate: '',
  weight: 0,
  country: '',
  cityState: '',
  address1: '',
  address2: '',
  phone: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelationship: '',
  leaderboardUsername: '',
  hideMetrics: false
})

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
    gender: {
      required: helpers.withMessage('Gender required', required)
    },
    birthdate: {
      required: helpers.withMessage('Date of Birth is required', required)
    },
    weight: {
      required: helpers.withMessage('Weight is required', required),
      minValue: helpers.withMessage('Weight must be higher than 1', minValue(1))
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
    hideMetrics: {
      required: helpers.withMessage('Field is required', required)
    }
  }
})

const successModalData = ref<{
  title: string
  message: string
  isLoading: boolean
  isVisible: boolean
}>({
  title: '',
  message: '',
  isLoading: false,
  isVisible: false
})

const errorModalData = ref<{
  isVisible: boolean
}>({
  isVisible: false
})

const v$ = useVuelidate(rules, formData)
const apiService = inject<ApiService>('gqlApiService')!

onMounted(() => {
  getCountries()
  getMyself()
})

async function getMyself(): Promise<void> {
  const user = await apiService.getMyself()

  if (user !== null) {
    await getCountryStates(user.country.code)

    formData.firstName = user.firstName
    formData.lastName = user.lastName
    formData.gender = user.gender !== null ? user.gender!.toString() : GenderEnum.N.toString()
    formData.birthdate = user.birthdate
    formData.weight = user.weight !== null ? user.weight! : 0
    formData.country = user.country.code
    formData.cityState = user.state!.code
    formData.address1 = user.address1
    formData.address2 = user.address2!
    formData.phone = user.phone
    formData.emergencyContactName = user.emergencyContactName
    formData.emergencyContactPhone = user.emergencyContactPhone
    formData.emergencyContactRelationship = user.emergencyContactRelationship!
    formData.leaderboardUsername = user.leaderboardUsername!
    formData.hideMetrics = user.hideMetrics !== null ? user.hideMetrics! : false
  }
}

const submitForm = async () => {
  const isValid = await v$.value.$validate()

  if (isValid) {
    isSaving.value = true

    let gender: GenderEnum = GenderEnum.N

    if (formData.gender === 'M') gender = GenderEnum.M
    else if (formData.gender === 'F') gender = GenderEnum.F

    const input: UserInput = {
      address1: formData.address1 == '' ? '-' : formData.address1,
      address2: formData.address2,
      birthdate: formData.birthdate,
      city: formData.cityState,
      country: formData.country,
      hideMetrics: formData.hideMetrics,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactPhone: formData.emergencyContactPhone,
      emergencyContactRelationship: formData.emergencyContactRelationship,
      firstName: formData.firstName,
      gender: gender,
      lastName: formData.lastName,
      leaderboardUsername: formData.leaderboardUsername,
      phone: formData.phone,
      state: formData.cityState,
      weight: formData.weight,
      zipCode: '0000'
    }

    const response = await apiService.updateCurrentUser(input)
    isSaving.value = false

    if (response === 'UpdateProfileSuccess') {
      successModalData.value.isVisible = true
    } else {
      errorModalData.value.isVisible = true
    }
  } else {
    console.log(formData)
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
    <h1>My Profile</h1>

    <div class="field">
      <button type="button">Change Password</button>
    </div>

    <div class="field">
      <input type="checkbox" v-model="formData.hideMetrics" />
      <label class="custom-control-label" for="customSwitch1"
        >Display my info on all performance leaderboards</label
      >
      <p>
        <span v-for="error in v$.hideMetrics.$errors" :key="error.$uid" style="color: red">{{
          error.$message
        }}</span>
      </p>
    </div>

    <h3>Personal Information</h3>
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

    <!--weight-->
    <div class="field">
      <p>
        <input class="input" v-model="formData.weight" type="number" placeholder="Weight *" />
      </p>
      <p>
        <span v-for="error in v$.weight.$errors" :key="error.$uid" style="color: red">{{
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

    <!--submit button-->
    <button type="submit" :disabled="isSaving">Save Profile</button>
  </form>

  <ModalComponent
    :title="'Profile update'"
    :message="'Your profile was successfully updated'"
    :closable="false"
    @on-ok="successModalData.isVisible = false"
    v-if="successModalData.isVisible"
  >
  </ModalComponent>

  <ModalComponent
    title="Error"
    message="Ups! Sorry, we didn't see that coming!. Please try again or communicate with the team to resolve this issue."
    :closable="false"
    v-if="errorModalData.isVisible"
    @on-ok="errorModalData.isVisible = false"
  >
  </ModalComponent>
</template>
