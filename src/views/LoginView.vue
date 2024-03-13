<script lang="ts">
enum SiteEnum {
  AbuDhabi = 'abu_dhabi',
  Dubai = 'dubai'
}
</script>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import router from '@/router'
import { authService } from '@/services/authService'
import { helpers, required, email } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

import DefaultButtonComponent from '@/components/DefaultButtonComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'

import { useRoute } from 'vue-router'
import { ResetPasswordRequiredError } from '@/model/Exception'

const displayLoginError = ref(false)
const isSubmitting = ref(false)
const selectedSite = ref('dubai')
const passwordIsVisible = ref(false)
const modalResetPasswordRequiredIsVisible = ref(false)

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
const route = useRoute()
async function login() {
  const isValid = await v$.value.$validate()

  if (isValid) {
    isSubmitting.value = true
    displayLoginError.value = false

    try {
      await authService.login(formData.email, formData.password, selectedSite.value)
      let redirectTo = route.query.redirect ?? '/'
      if (redirectTo !== '/') {
        await router.push({ path: route.query.redirect as string })
      } else {
        await router.push({ name: 'calendar' })
      }
    } catch (error) {
      if (error instanceof ResetPasswordRequiredError) {
        modalResetPasswordRequiredIsVisible.value = true
      } else {
        displayLoginError.value = true
      }
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
              <label for="emailRegistration" class="input-label">Email *</label>
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
              <label for="passwordRegistration" class="input-label">Password *</label>
              <div class="input-group">
                <input
                  id="passwordRegistration"
                  class="form-control"
                  v-model="formData.password"
                  :type="passwordIsVisible ? 'text' : 'password'"
                  placeholder="Password"
                  maxlength="100"
                  required
                />
                <div
                  class="input-group-prepend"
                  @click="passwordIsVisible = !passwordIsVisible"
                  style="cursor: pointer"
                >
                  <span
                    class="input-group-text"
                    id="passwordEye"
                    style="background-color: transparent"
                  >
                    <i v-if="passwordIsVisible" class="bi bi-eye-slash-fill"></i>
                    <i v-else class="bi bi-eye-fill"></i>
                  </span>
                </div>
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
            <button
              type="button"
              class="btn btn-primary btn-block"
              @click="router.push({ name: 'register' })"
            >
              New User
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ModalComponent
    v-if="modalResetPasswordRequiredIsVisible"
    title="Reset password is required"
    message="YOU NEED TO RESET YOUR PASSWORD AS IT HAS EXPIRED. GO TO FORGOT PASSWORD TO CREATE A NEW ONE."
    ok-text="OK"
    :cancel-text="null"
    :closable="false"
    @on-ok="router.push({ name: 'forgot_password' })"
  ></ModalComponent>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
p {
  font-family: 'Avenir', sans-serif;
}
.page-login-v3 .panel .panel-body {
  padding: 50px 40px 40px;
}

.card {
  height: 613px;
  margin-top: auto;
  margin-bottom: auto;
  width: 400px;
}

a:link {
  color: #ff7f61;
  background-color: transparent;
  text-decoration: none;
  font-family: 'BigJohn', sans-serif;
}

a:visited {
  color: #ff7f61;
  background-color: transparent;
  text-decoration: none;
  font-family: 'BigJohn', sans-serif;
}

a:hover {
  color: #737373;
  background-color: transparent;
  text-decoration: none;
  font-family: 'BigJohn', sans-serif;
}

a:active {
  color: #ff7f61;
  background-color: transparent;
  text-decoration: none;
  font-family: 'BigJohn', sans-serif;
}
</style>
