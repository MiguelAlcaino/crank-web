<script setup lang="ts">
import dayjs from 'dayjs'

defineProps<{ dates: Date[] }>()
</script>

<template>
  <div class="row">
    <div class="col" v-for="(date, key) in dates" :key="key">
      <b> {{ dayjs(date).format('ddd').toUpperCase() }}</b
      ><br />
      <b> {{ dayjs(date).format('DD.MM') }}</b>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
