<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import router from '@/router'
import { authService } from '@/services/authService'
import { helpers, required, email } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

import { SiteEnum } from '@/gql/graphql'

import DefaultButtonComponent from '../components/DefaultButtonComponent.vue'

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
  <div class="d-flex justify-content-center h-100">
    <div class="card">
      <div class="card-body mt-5">
        <form @submit.prevent="login" autocomplete="off">
          <!-- location -->
          <div class="form-row">
            <div class="col-md-12 mb-3">
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
            <div class="col-md-12 mb-3">
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
            <div class="col-md-12 mb-3">
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
            Incorrect Login
          </small>

          <div class="row">
            <div class="col-md-12 mb-3" style="text-align: right">
              <RouterLink class="nav-link" :to="{ name: 'forgot_password' }"
                >Forgot Password?</RouterLink
              >
            </div>
          </div>

          <!--submit button-->
          <div class="row">
            <div class="col-md-12 mb-3">
              <DefaultButtonComponent
                class="btn-block"
                type="submit"
                :is-loading="isSubmitting"
                text="Login"
              ></DefaultButtonComponent>
            </div>
          </div>
        </form>
        <p>Don't have an account with us? Please signup here:</p>
        <div class="row">
          <div class="col-md-12 mb-3">
            <router-link class="btn btn-primary btn-block" to="/register">New User</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-login-v3 .panel .panel-body {
  padding: 50px 40px 40px;
}

a {
  color: #000000;
}

.card {
  height: 613px;
  margin-top: auto;
  margin-bottom: auto;
  width: 400px;
}
</style>
