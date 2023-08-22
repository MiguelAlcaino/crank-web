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
import { required, maxLength, helpers, minValue } from '@vuelidate/validators'
import { GenderEnum, type UserInput } from '@/gql/graphql'
import type { ApiService } from '@/services/apiService'

import ModalComponent from '@/components/ModalComponent.vue'

const isSaving = ref(false)
const successModalIsVisible = ref(false)
const errorModalIsVisible = ref(false)

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

  console.log(formData)

  if (isValid) {
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

    isSaving.value = true
    const response = await apiService.updateCurrentUser(input)
    isSaving.value = false

    if (response === 'UpdateProfileSuccess') {
      successModalIsVisible.value = true
    } else {
      errorModalIsVisible.value = true
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
  countries.value = (await apiService.getCountries()) as Country[]
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
  <h1>My Profile</h1>

  <form @submit.prevent="submitForm" autocomplete="off">
    <div class="field">
      <RouterLink class="btn btn-primary" :to="{ name: 'change_password' }"
        >Change Password</RouterLink
      >
    </div>
    <hr />

    <!-- hideMetrics -->
    <div class="form-row">
      <div class="col-md-12 mb-3">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="formData.hideMetrics"
            id="hideMetricsMyProfile"
          />
          <label class="form-check-label" for="hideMetricsMyProfile"
            >Display my info on all performance leaderboards</label
          >
          <small
            v-for="error in v$.hideMetrics.$errors"
            :key="error.$uid"
            class="form-text"
            style="color: red"
          >
            {{ error.$message }}
          </small>
        </div>
      </div>
    </div>

    <h3>Personal Information</h3>

    <div class="form-row">
      <!-- firstName -->
      <div class="col-md-6 mb-3">
        <label for="firstNameMyProfile">First Name *</label>
        <input
          id="firstNameMyProfile"
          class="form-control"
          v-model="formData.firstName"
          type="text"
          placeholder="First Name"
          maxlength="50"
          required
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
        <label for="lastNameMyProfile">Last Name *</label>
        <input
          id="lastNameMyProfile"
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
        <label for="genderMyProfile">Gender *</label>
        <select
          class="custom-select"
          v-model="formData.gender"
          id="genderMyProfile"
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
        <label for="leaderboardUsernameMyProfile">Leaderboard Nickname *</label>
        <input
          id="leaderboardUsernameMyProfile"
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
        <label for="dateOfBirthMyProfile">Date of Birth *</label>
        <input
          class="form-control"
          v-model="formData.birthdate"
          type="date"
          placeholder="Date of Birth *"
          id="dateOfBirthMyProfile"
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

    <!-- weight -->
    <div class="form-row">
      <div class="col-md-6 mb-3">
        <label for="weightMyProfile">Weight *</label>
        <input
          id="weightMyProfile"
          class="form-control"
          v-model="formData.weight"
          type="number"
          placeholder="Weight"
          required
        />
        <small
          v-for="error in v$.weight.$errors"
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
        <label for="countryMyProfile">Country *</label>
        <select
          class="custom-select"
          v-model="formData.country"
          @change="onChangeCountry()"
          id="countryMyProfile"
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
        <label for="cityStateMyProfile">City/State *</label>
        <select class="custom-select" v-model="formData.cityState" id="cityStateMyProfile" required>
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
        <label for="address1MyProfile">Address Line 1</label>
        <input
          id="address1MyProfile"
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
        <label for="address2MyProfile">Address Line 2</label>
        <input
          id="address2MyProfile"
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
        <label for="mobileNumberMyProfile">Mobile Number *</label>
        <input
          id="mobileNumberMyProfile"
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
        <label for="emergencyContactNameMyProfile">Emergency Contact Name *</label>
        <input
          id="emergencyContactNameMyProfile"
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
        <label for="emergencyContactPhoneMyProfile">Emergency Contact Number *</label>
        <input
          id="emergencyContactPhoneMyProfile"
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
        <label for="emergencyContactRelationshipMyProfile">Emergency Contact Relationship *</label>
        <select
          class="custom-select"
          v-model="formData.emergencyContactRelationship"
          id="emergencyContactRelationshipMyProfile"
          required
        >
          <option value="Friend">Friend</option>
          <option value="Relative">Relative</option>
          <option value="Other">Other</option>
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

    <!--submit button-->
    <div class="form-row">
      <div class="col-md-12 mb-3">
        <button class="btn btn-primary" type="submit" :disabled="isSaving">
          Save Profile <span class="spinner-border spinner-border-sm" v-if="isSaving"></span>
        </button>
      </div>
    </div>
  </form>

  <!-- Success Modal -->
  <ModalComponent
    :title="'Profile update'"
    :message="'Your profile was successfully updated'"
    :closable="false"
    @on-ok="successModalIsVisible = false"
    v-if="successModalIsVisible"
  >
  </ModalComponent>

  <!-- Error Modal -->
  <ModalComponent
    title="Error"
    message="Ups! Sorry, we didn't see that coming!. Please try again or communicate with the team to resolve this issue."
    :closable="false"
    v-if="errorModalIsVisible"
    @on-ok="errorModalIsVisible = false"
  >
  </ModalComponent>
</template>
