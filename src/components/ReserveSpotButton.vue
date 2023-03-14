<script setup lang="ts">

const emits = defineEmits<{
  (event: "clickBookClass"): void
}>();

function onClickBookClassBtn(): void {
  emits("clickBookClass")
}
</script>

<template>
  <div>
    <div class="text-center">
      <a type="button" @click="onClickBookClassBtn()" class="btn btn-primary btn-cons waves-effect waves-light">
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
</style>
