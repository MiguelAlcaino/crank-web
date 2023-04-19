<script setup lang="ts">
import { authService } from '@/services/authService'
import { ModalsContainer } from 'vue-final-modal'
</script>

<template>
  <!-- START NAV -->
  <nav class="navbar is-black mb-5">
    <div class="container">
      <div class="navbar-brand">
        <div class="navbar-burger burger" data-target="navMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </nav>
  <!-- END NAV -->
  <div class="container">
    <div class="columns">
      <div class="column is-3">
        <aside class="menu is-hidden-mobile">
          <p class="menu-label">General</p>
          <ul class="menu-list">
            <li v-if="!authService.isLoggedId()">
              <RouterLink :to="{ name: 'login' }">Login</RouterLink>
            </li>
            <li v-if="authService.isLoggedId()">
              <a href="#" @click="authService.logout()">logout</a>
            </li>
          </ul>
        </aside>
      </div>
      <div class="column is-9">
        <RouterView />
      </div>
    </div>
  </div>
  <ModalsContainer />
</template>

<style scoped></style>
