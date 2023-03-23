<script setup lang="ts">

defineProps<{
  enrollmentEnabled: boolean,
}>();

const emits = defineEmits<{
  (event: "clickBookWaitList"): void
}>();

function onClickWaitListButton(): void {
  emits("clickBookWaitList");
}
</script>

<template>
  <div>
    <div class="text-center">
      <a type="button" @click="onClickWaitListButton()" class="btn btn-primary btn-cons waves-effect waves-light"
         :class="{disabled: !enrollmentEnabled}">
        <i class="fa fa-bullseye" aria-hidden="true"></i>
        <div>Enroll on the WaitList</div>
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
</style>
