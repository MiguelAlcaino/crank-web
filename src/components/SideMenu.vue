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
        <a
          class="list-group-item border-0"
          :class="{ active: route.name === 'workout_stats' }"
          href="/workout-stats"
          role="tab"
        >
          <i class="bi bi-bar-chart-fill" aria-hidden="true"></i> &nbsp; Workout Stats
        </a>
        <a
          class="list-group-item border-0"
          :class="{ active: route.name === 'calendar' }"
          href="/calendar"
          role="tab"
        >
          <i class="bi bi-calendar3" aria-hidden="true"></i> &nbsp; Book Classes
        </a>
        <a
          class="list-group-item border-0"
          :class="{ active: route.name === 'bookings' }"
          href="/bookings"
          role="tab"
        >
          <i class="bi bi-calendar-check" aria-hidden="true"></i> &nbsp; Bookings
        </a>
        <a
          class="list-group-item border-0"
          :class="{ active: route.name === 'purchases' }"
          href="/purchases"
          role="tab"
        >
          <i class="bi bi-credit-card" aria-hidden="true"></i> &nbsp; Purchases
        </a>
        <a
          class="list-group-item border-0"
          :class="{ active: route.name === 'profile' }"
          href="/profile"
          role="tab"
        >
          <i class="bi bi-person-fill" aria-hidden="true"></i> &nbsp; Profile
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-group a.active,
.list-group a.active {
  background-color: #000000;
  border-color: #000000;
}

a.list-group-item:hover,
button.list-group-item:hover,
a.list-group-item:focus,
button.list-group-item:focus {
  color: #757575;
  background-color: #eee;
}

a.list-group-item:focus,
a.list-group-item:hover,
button.list-group-item:focus,
button.list-group-item:hover {
  color: #757575;
  text-decoration: none;
  background-color: #eee;
}
</style>
