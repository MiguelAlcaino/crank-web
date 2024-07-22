<script setup lang="ts">
defineProps<{
  className?: string
  spotNumber?: number
}>()
</script>

<template>
  <div class="row p-3">
    <div class="col-12 text-center">
      <h4>SPOT</h4>
    </div>
    <div class="col-6 text-right">
      <i
        v-if="className?.toUpperCase().includes('RIDE')"
        class="bi bi-bicycle"
        style="font-size: 4rem"
      ></i>
      <img
        v-if="className?.toUpperCase().includes('SHAPE')"
        src="../assets/icons/shape_icon.png"
        alt=""
        height="50"
      />
      <img
        v-if="className?.toUpperCase().includes('STRETCH')"
        src="../assets/icons/stretch_icon.png"
        alt=""
        height="50"
      />
    </div>
    <div class="col-6 text-left align-middle">
      <p>
        {{ spotNumber ?? 'N/A' }}
      </p>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
p {
  font-family: 'BigJohn', sans-serif;
  font-size: xx-large;
}
h4 {
  color: #737373;
}
</style>
