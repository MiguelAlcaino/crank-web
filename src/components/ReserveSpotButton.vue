<script setup lang="ts">
import type { Class } from "@/gql/graphql";

const props = defineProps<{
  classInfo: Class,
}>();

const emits = defineEmits<{
  (event: "clickBookClass", classId: string, spotNumber: number | null, isWaitlistBooking: boolean | null): void
}>();

function onClickBookClassBtn(): void {
  emits("clickBookClass", props.classInfo!.id, null, null)
}
</script>

<template>
  <div>
    <div class="text-center">
      <a type="button" @click="onClickBookClassBtn()" class="btn btn-primary btn-cons waves-effect waves-light" style="">
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
