<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import router from '@/router'
import { authService } from '@/services/authService'
import { helpers, required, email } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

import { SiteEnum } from '@/gql/graphql'

const displayLoginError = ref(false)
const isSubmitting = ref(false)
const selectedSite = ref('dubai')

const formData = reactive({
  location: SiteEnum.Dubai,
  email: '',
  password: ''
})

const rules = computed(() => {
  return {
    location: {
      required: helpers.withMessage('Location is required', required)
    },
    email: {
      required: helpers.withMessage('Email is required', required),
      email: helpers.withMessage('The email address is not valid', email)
    },
    password: {
      required: helpers.withMessage('Password is required', required)
    }
  }
})

const v$ = useVuelidate(rules, formData)

async function login() {
  const isValid = await v$.value.$validate()

  if (isValid) {
    isSubmitting.value = true
    displayLoginError.value = false

    try {
      await authService.login(formData.email, formData.password, selectedSite.value)
      await router.push({ name: 'calendar' })
    } catch (error) {
      displayLoginError.value = true
    }
    isSubmitting.value = false
  }
}
</script>

<template>
  <form @submit.prevent="login" autocomplete="off">
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
          maxlength="100"
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
    </div>

    <small v-if="displayLoginError" class="form-text" style="color: red">
      This email or password
    </small>

    <!--submit button-->
    <div class="form-row">
      <div class="col-md-12 mb-3">
        <button class="btn btn-primary" type="submit" :disabled="isSubmitting">
          Login <span class="spinner-border spinner-border-sm" v-if="isSubmitting"></span>
        </button>
      </div>
    </div>
  </form>
  <p>New to CRANK? <router-link to="/register">Sign up now.</router-link></p>
</template>
