<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Class } from "@/gql/graphql";

const props = defineProps<{
  classInfo: Class,
}>();

const emits = defineEmits<{
  (event: 'bookClass'): void
}>();

const showModal = ref(false);

function bookClass(): void {
  showModal.value = true;
  console.log("bookClass");
}


</script>

<template>
  <div>
    <div class="text-center">
      <a id="ReserveSpotButton" type="button" @click="bookClass()"
        class="btn btn-primary btn-cons waves-effect waves-light" style="">
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
</style>
