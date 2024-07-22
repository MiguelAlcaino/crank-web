<script setup lang="ts">
defineProps<{
  title: string
  avgValue: number
  highValue: number
}>()
</script>

<template>
  <div class="row p-3">
    <div class="col-12">
      <div class="row">
        <div class="col-12 text-center">
          <h4>{{ title }}</h4>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="row">
            <div class="col-5 text-right">
              <p>AVG</p>
            </div>
            <div class="col-2 text-center"></div>
            <div class="col-5 text-left">
              <p>HIGH</p>
            </div>
          </div>
          <div class="row">
            <div class="col-5 text-right">
              <p>{{ avgValue }}</p>
            </div>
            <div class="col-2 text-center">
              <h2>/</h2>
            </div>
            <div class="col-5 text-left">
              <p>{{ highValue }}</p>
            </div>
          </div>
        </div>
      </div>
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
