<script setup lang="ts">
import { ref } from 'vue'
import ShoppingCartDrawer from '../components/ShoppingCartDrawer.vue'

const isCartOpen = ref(false)

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}
</script>

<template>
  <div>
    <header>
      <div class="header-content">
        <h3></h3>
        <ShoppingCartDrawer @close="toggleCart" />
      </div>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #ddd;
}
</style>
