<script setup lang="ts">
defineProps<{
  title: string
  icon: 'total_energy' | 'calories' | 'distance' | 'duration'
  value: string
}>()
</script>

<template>
  <div class="row p-3">
    <div class="col-12 text-center">
      <h4>{{ title }}</h4>
    </div>
    <div class="col-6 text-right">
      <i v-if="icon === 'duration'" class="bi bi-stopwatch-fill" style="font-size: 4rem"></i>
      <i v-if="icon === 'distance'" class="bi bi-arrows-angle-expand" style="font-size: 4rem"></i>
      <i v-if="icon === 'calories'" class="bi bi-fire" style="font-size: 4rem"></i>
      <i v-if="icon === 'total_energy'" class="bi bi-star-fill" style="font-size: 4rem"></i>
    </div>
    <div class="col-6 text-left align-middle">
      <p>{{ value }}</p>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
p {
  font-family: 'BigJohn', sans-serif;
  font-size: x-large;
}
h4 {
  color: #737373;
}
</style>
