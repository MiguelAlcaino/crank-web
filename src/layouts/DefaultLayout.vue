<template>
  <nav class="navbar is-black mb-5">
    <div class="container">
      <div class="navbar-brand">
        <div class="navbar-burger burger" data-target="navMenu"></div>
      </div>
    </div>
  </nav>

  <div class="container">
    <div class="columns">
      <div class="column is-3">
        <aside class="menu is-hidden-mobile">
          <nav
            class="navbar navbar-expand-lg navbar-light bg-light"
            v-if="authService.isLoggedId()"
          >
            <div class="collapse navbar-collapse" id="navbarText">
              <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                  <RouterLink class="nav-link" :to="{ name: 'calendar' }">Calendar</RouterLink>
                </li>
                <li class="nav-item">
                  <RouterLink class="nav-link" :to="{ name: 'profile' }">Profile</RouterLink>
                </li>
                <li class="nav-item">
                  <RouterLink class="nav-link" :to="{ name: 'bookings' }">Bookings</RouterLink>
                </li>
                <li class="nav-item">
                  <RouterLink class="nav-link" :to="{ name: 'purchases' }">Purchases</RouterLink>
                </li>
              </ul>
            </div>
          </nav>
          <ul class="menu-list">
            <li v-if="!authService.isLoggedId()" style="display: inline">
              <RouterLink :to="{ name: 'login' }">Login</RouterLink>
            </li>
            <li v-if="authService.isLoggedId()" style="display: inline">
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
</template>

<script setup lang="ts">
import { authService } from '@/services/authService'
</script>

<style scoped></style>
