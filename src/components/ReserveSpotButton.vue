<script setup lang="ts">
defineProps<{
  enrollmentEnabled: boolean
}>()

const emits = defineEmits<{
  (event: 'clickBookClass'): void
}>()

function onClickBookClassBtn(): void {
  emits('clickBookClass')
}
</script>

<template>
  <div>
    <div class="text-center">
      <a
        type="button"
        @click="onClickBookClassBtn()"
        class="btn btn-primary"
        :class="{ disabled: !enrollmentEnabled }"
      >
        <i class="fa fa-bullseye" aria-hidden="true"></i>
        <div>Sign up for this class</div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.btn-primary {
  color: #fff;
  background-color: #000000;
  border-color: #000000;
}

.btn-primary:hover {
  color: #fff;
  background-color: grey;
  border-color: grey;
}

.btn.btn-primary:disabled {
  color: #fff;
  background-color: grey;
  border-color: grey;
}
</style>
