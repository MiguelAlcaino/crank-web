<script setup lang="ts">
import { ref } from 'vue'

const isCartOpen = ref(false)

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}
</script>

<template>
  <div>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
