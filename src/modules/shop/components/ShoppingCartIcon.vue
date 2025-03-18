<script setup lang="ts">
defineProps<{
  totalItems: number
}>()

const emits = defineEmits<{
  (e: 'open'): void
}>()

const open = () => {
  emits('open')
}
</script>

<template>
  <div class="icon-wrapper" @click="open">
    <i class="bi bi-bag" style="font-size: 2rem"></i>
    <span class="number">{{ totalItems }}</span>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
.icon-wrapper {
  cursor: pointer;
  position: relative;
  display: inline-block;
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  font-size: 24px;
  background-color: transparent;
  border-radius: 50%;
}

.icon-wrapper .number {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: black;
  font-size: 10px;
}
</style>
