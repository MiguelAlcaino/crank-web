<script setup lang="ts">
import { ref } from "vue";
import router from "@/router";
import { authService } from "@/services/authService";

const email = ref("");
const password = ref("");
const displayLoginError = ref(false);
const isSubmitting = ref(false);
const selectedSite = ref("dubai");
const sites = ["dubai", "abu_dhabi"];

async function login() {
  isSubmitting.value = true;
  displayLoginError.value = false;

  if (email.value && password.value) {
    try {
      await authService.login(email.value, password.value, selectedSite.value);
      await router.push({ name: 'home' })
    } catch (error) {
      displayLoginError.value = true;
    }
    isSubmitting.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="login">
    <select v-model="selectedSite">
      <option v-for="site in sites" :value="site" :key="site">
        {{ site }}
      </option>
    </select>

    <div class="field">
      <p class="control">
        <input v-model="email" class="input" type="email" placeholder="Email" />
      </p>
    </div>
    <div class="field">
      <p class="control">
        <input
          v-model="password"
          class="input"
          type="password"
          placeholder="Password"
        />
      </p>
    </div>
    <p class="help is-danger" v-if="displayLoginError">
      This email or password
    </p>
    <div class="field">
      <p class="control">
        <button
          type="submit"
          class="button is-success"
          :class="{ 'is-loading': isSubmitting }"
        >
          Login
        </button>
      </p>
    </div>
  </form>
</template>
