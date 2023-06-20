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
const sites = ['dubai', 'abu_dhabi']

const formData = reactive({
  email: '',
  password: ''
})

const rules = computed(() => {
  return {
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
    <select class="input" v-model="selectedSite">
      <option :value="SiteEnum.Dubai">Dubai</option>
      <option :value="SiteEnum.AbuDhabi">Abu Dhabi</option>
    </select>
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

    <p class="help is-danger" v-if="displayLoginError">This email or password</p>
    <div class="field">
      <p class="control">
        <button type="submit" class="button is-success" :class="{ 'is-loading': isSubmitting }">
          Login
        </button>
      </p>
    </div>
  </form>
  <p>New to CRANK? <router-link to="/register">Sign up now.</router-link></p>
</template>
