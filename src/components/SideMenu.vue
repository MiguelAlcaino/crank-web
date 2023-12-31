<script setup lang="ts">
import { authService } from '@/services/authService'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="list-group">
        <a class="list-group-item border-0" href="#" role="tab" @click="authService.logout()">
          <i class="bi bi-box-arrow-right" aria-hidden="true"></i> &nbsp; Log Out
        </a>
        <router-link
          :to="{ name: 'workout_stats' }"
          class="list-group-item border-0"
          :class="{ active: route.name === 'workout_stats' }"
        >
          <i class="bi bi-bar-chart-fill" aria-hidden="true"></i> &nbsp; Workout Stats</router-link
        >
        <router-link
          :to="{ name: 'calendar' }"
          class="list-group-item border-0"
          :class="{ active: route.name === 'calendar' }"
        >
          <i class="bi bi-calendar3" aria-hidden="true"></i> &nbsp; Book Classes</router-link
        >
        <router-link
          :to="{ name: 'bookings' }"
          class="list-group-item border-0"
          :class="{ active: route.name === 'bookings' }"
        >
          <i class="bi bi-calendar-check" aria-hidden="true"></i> &nbsp; Bookings</router-link
        >
        <router-link
          :to="{ name: 'purchases' }"
          class="list-group-item border-0"
          :class="{ active: route.name === 'purchases' }"
        >
          <i class="bi bi-credit-card" aria-hidden="true"></i> &nbsp; Purchases</router-link
        >

        <router-link
          :to="{ name: 'profile' }"
          class="list-group-item border-0"
          :class="{ active: route.name === 'profile' }"
        >
          <i class="bi bi-person-fill" aria-hidden="true"></i> &nbsp; Profile</router-link
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-group a.active {
  background-color: #000000;
  border-color: #000000;
}

a.list-group-item:hover,
button.list-group-item:hover,
button.list-group-item:focus {
  color: #757575;
  background-color: #eee;
}

a.list-group-item:hover {
  color: #757575;
  text-decoration: none;
  background-color: #eee;
}

a {
  color: #000000;
}
</style>
